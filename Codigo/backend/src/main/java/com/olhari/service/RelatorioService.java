package com.olhari.service;

import com.olhari.dto.RelatorioDestaqueResponse;
import com.olhari.dto.RelatorioFaturamentoResponse;
import com.olhari.dto.RelatorioPeriodoResponse;
import com.olhari.enums.StatusEnsaio;
import com.olhari.enums.TipoPeriodoRelatorio;
import com.olhari.model.Album;
import com.olhari.model.Ensaio;
import com.olhari.repository.AlbumRepository;
import com.olhari.repository.EnsaioRepository;
import com.olhari.repository.SelecaoFotoRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import com.olhari.dto.RelatorioComparativoResponse;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RelatorioService {

        private final EnsaioRepository ensaioRepository;
        private final AlbumRepository albumRepository;
        private final SelecaoFotoRepository selecaoFotoRepository;

        @Transactional(readOnly = true)
        public RelatorioFaturamentoResponse buscarFaturamento(TipoPeriodoRelatorio tipo, Integer ano) {
                TipoPeriodoRelatorio tipoFinal = tipo == null ? TipoPeriodoRelatorio.MENSAL : tipo;
                int anoFinal = ano == null ? LocalDate.now().getYear() : ano;

                List<PeriodoRelatorioInterno> periodosInternos = gerarPeriodos(tipoFinal, anoFinal);

                List<Ensaio> ensaios = ensaioRepository.findAll();

                Map<UUID, Album> albumPorEnsaio = albumRepository.findAll()
                                .stream()
                                .filter(album -> album.getEnsaio() != null)
                                .filter(album -> album.getEnsaio().getId() != null)
                                .collect(Collectors.toMap(
                                                album -> album.getEnsaio().getId(),
                                                Function.identity(),
                                                (albumExistente, albumNovo) -> albumExistente));

                Map<UUID, Integer> totalSelecoesPorAlbum = albumPorEnsaio.values()
                                .stream()
                                .collect(Collectors.toMap(
                                                Album::getId,
                                                album -> selecaoFotoRepository.findByAlbumId(album.getId()).size()));

                List<RelatorioPeriodoResponse> periodos = periodosInternos.stream()
                                .map(periodo -> montarPeriodo(
                                                periodo,
                                                ensaios,
                                                albumPorEnsaio,
                                                totalSelecoesPorAlbum))
                                .toList();

           BigDecimal faturamentoBruto = somar(periodos, RelatorioPeriodoResponse::getFaturamento);
BigDecimal excedentesCobrados = somar(periodos, RelatorioPeriodoResponse::getExcedentesCobrados);
BigDecimal totalLiquido = faturamentoBruto.add(excedentesCobrados);

int ensaiosRealizados = periodos.stream()
        .map(RelatorioPeriodoResponse::getQuantidadeEnsaios)
        .reduce(0, Integer::sum);

BigDecimal mediaPorPeriodo = calcularMedia(totalLiquido, periodos.size());

RelatorioDestaqueResponse destaques = montarDestaques(periodos);

int anoComparado = anoFinal - 1;

List<PeriodoRelatorioInterno> periodosInternosAnoAnterior =
        gerarPeriodos(tipoFinal, anoComparado);

List<RelatorioPeriodoResponse> periodosAnoAnterior = periodosInternosAnoAnterior.stream()
        .map(periodo -> montarPeriodo(
                periodo,
                ensaios,
                albumPorEnsaio,
                totalSelecoesPorAlbum
        ))
        .toList();

BigDecimal totalLiquidoAnoAnterior =
        somar(periodosAnoAnterior, RelatorioPeriodoResponse::getTotalLiquido);

int ensaiosAnoAnterior = periodosAnoAnterior.stream()
        .map(RelatorioPeriodoResponse::getQuantidadeEnsaios)
        .reduce(0, Integer::sum);

RelatorioComparativoResponse comparativo = montarComparativo(
        totalLiquido,
        totalLiquidoAnoAnterior,
        ensaiosRealizados,
        ensaiosAnoAnterior,
        anoComparado
);

           return RelatorioFaturamentoResponse.builder()
        .tipo(tipoFinal)
        .ano(anoFinal)
        .periodoDescricao(montarDescricao(tipoFinal, anoFinal))
        .unidadePeriodo(resolverUnidadePeriodo(tipoFinal))
        .faturamentoTotal(totalLiquido)
        .mediaPorPeriodo(mediaPorPeriodo)
        .ensaiosRealizados(ensaiosRealizados)
        .faturamentoBruto(faturamentoBruto)
        .excedentesCobrados(excedentesCobrados)
        .totalLiquido(totalLiquido)
        .destaques(destaques)
        .comparativo(comparativo)
        .periodos(periodos)
        .build();
        }

        private RelatorioPeriodoResponse montarPeriodo(
                        PeriodoRelatorioInterno periodo,
                        List<Ensaio> ensaios,
                        Map<UUID, Album> albumPorEnsaio,
                        Map<UUID, Integer> totalSelecoesPorAlbum) {
                List<Ensaio> ensaiosDoPeriodo = ensaios.stream()
                                .filter(this::isEnsaioFinanceiro)
                                .filter(ensaio -> estaDentroDoPeriodo(ensaio, periodo))
                                .toList();

                BigDecimal faturamento = ensaiosDoPeriodo.stream()
                                .map(Ensaio::getValorPacote)
                                .filter(valor -> valor != null)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal excedentes = ensaiosDoPeriodo.stream()
                                .map(ensaio -> calcularExcedenteDoEnsaio(
                                                ensaio,
                                                albumPorEnsaio,
                                                totalSelecoesPorAlbum))
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal totalLiquido = faturamento.add(excedentes);

                return RelatorioPeriodoResponse.builder()
                                .label(periodo.getLabel())
                                .inicio(periodo.getInicio())
                                .fim(periodo.getFim())
                                .faturamento(faturamento)
                                .excedentesCobrados(excedentes)
                                .totalLiquido(totalLiquido)
                                .quantidadeEnsaios(ensaiosDoPeriodo.size())
                                .build();
        }

        private boolean isEnsaioFinanceiro(Ensaio ensaio) {
                return ensaio.getStatus() == StatusEnsaio.FINALIZADO;
        }

        private boolean estaDentroDoPeriodo(Ensaio ensaio, PeriodoRelatorioInterno periodo) {
                if (ensaio.getDataEnsaio() == null) {
                        return false;
                }

                OffsetDateTime data = ensaio.getDataEnsaio();

                OffsetDateTime inicio = periodo.getInicio()
                                .atStartOfDay()
                                .atOffset(ZoneOffset.UTC);

                OffsetDateTime fimExclusivo = periodo.getFim()
                                .plusDays(1)
                                .atStartOfDay()
                                .atOffset(ZoneOffset.UTC);

                return !data.isBefore(inicio) && data.isBefore(fimExclusivo);
        }

        private BigDecimal calcularExcedenteDoEnsaio(
                        Ensaio ensaio,
                        Map<UUID, Album> albumPorEnsaio,
                        Map<UUID, Integer> totalSelecoesPorAlbum) {
                if (!Boolean.TRUE.equals(ensaio.getCobrarFotoExtra())) {
                        return BigDecimal.ZERO;
                }

                if (ensaio.getValorFotoExtra() == null || ensaio.getQtdFotosPacote() == null) {
                        return BigDecimal.ZERO;
                }

                Album album = albumPorEnsaio.get(ensaio.getId());

                if (album == null) {
                        return BigDecimal.ZERO;
                }

                int totalSelecionadas = totalSelecoesPorAlbum.getOrDefault(album.getId(), 0);
                int excedentes = Math.max(0, totalSelecionadas - ensaio.getQtdFotosPacote());

                return ensaio.getValorFotoExtra().multiply(BigDecimal.valueOf(excedentes));
        }

        private List<PeriodoRelatorioInterno> gerarPeriodos(TipoPeriodoRelatorio tipo, int ano) {
                return switch (tipo) {
                        case ANUAL -> gerarPeriodoAnual(ano);
                        case SEMESTRAL -> gerarPeriodosSemestrais(ano);
                        case TRIMESTRAL -> gerarPeriodosTrimestrais(ano);
                        case MENSAL -> gerarPeriodosMensais(ano);
                };
        }

        private List<PeriodoRelatorioInterno> gerarPeriodosMensais(int ano) {
                return List.of(
                                periodo("Jan", LocalDate.of(ano, Month.JANUARY, 1),
                                                LocalDate.of(ano, Month.JANUARY, 31)),
                                periodo("Fev", LocalDate.of(ano, Month.FEBRUARY, 1),
                                                LocalDate.of(ano, Month.FEBRUARY,
                                                                LocalDate.of(ano, Month.FEBRUARY, 1).lengthOfMonth())),
                                periodo("Mar", LocalDate.of(ano, Month.MARCH, 1), LocalDate.of(ano, Month.MARCH, 31)),
                                periodo("Abr", LocalDate.of(ano, Month.APRIL, 1), LocalDate.of(ano, Month.APRIL, 30)),
                                periodo("Mai", LocalDate.of(ano, Month.MAY, 1), LocalDate.of(ano, Month.MAY, 31)),
                                periodo("Jun", LocalDate.of(ano, Month.JUNE, 1), LocalDate.of(ano, Month.JUNE, 30)),
                                periodo("Jul", LocalDate.of(ano, Month.JULY, 1), LocalDate.of(ano, Month.JULY, 31)),
                                periodo("Ago", LocalDate.of(ano, Month.AUGUST, 1), LocalDate.of(ano, Month.AUGUST, 31)),
                                periodo("Set", LocalDate.of(ano, Month.SEPTEMBER, 1),
                                                LocalDate.of(ano, Month.SEPTEMBER, 30)),
                                periodo("Out", LocalDate.of(ano, Month.OCTOBER, 1),
                                                LocalDate.of(ano, Month.OCTOBER, 31)),
                                periodo("Nov", LocalDate.of(ano, Month.NOVEMBER, 1),
                                                LocalDate.of(ano, Month.NOVEMBER, 30)),
                                periodo("Dez", LocalDate.of(ano, Month.DECEMBER, 1),
                                                LocalDate.of(ano, Month.DECEMBER, 31)));
        }

        private List<PeriodoRelatorioInterno> gerarPeriodosTrimestrais(int ano) {
                return List.of(
                                periodo("1º trim.", LocalDate.of(ano, 1, 1), LocalDate.of(ano, 3, 31)),
                                periodo("2º trim.", LocalDate.of(ano, 4, 1), LocalDate.of(ano, 6, 30)),
                                periodo("3º trim.", LocalDate.of(ano, 7, 1), LocalDate.of(ano, 9, 30)),
                                periodo("4º trim.", LocalDate.of(ano, 10, 1), LocalDate.of(ano, 12, 31)));
        }

        private PeriodoRelatorioInterno periodo(String label, LocalDate inicio, LocalDate fim) {
                return new PeriodoRelatorioInterno(label, inicio, fim);
        }

        private RelatorioDestaqueResponse montarDestaques(List<RelatorioPeriodoResponse> periodos) {
                RelatorioPeriodoResponse maior = periodos.stream()
                                .max(Comparator.comparing(RelatorioPeriodoResponse::getTotalLiquido))
                                .orElse(null);

                RelatorioPeriodoResponse menor = periodos.stream()
                                .filter(periodo -> periodo.getTotalLiquido().compareTo(BigDecimal.ZERO) > 0)
                                .min(Comparator.comparing(RelatorioPeriodoResponse::getTotalLiquido))
                                .orElse(null);

                return RelatorioDestaqueResponse.builder()
                                .melhorPeriodo(maior != null ? maior.getLabel() : "-")
                                .maiorReceita(maior != null ? maior.getTotalLiquido() : BigDecimal.ZERO)
                                .menorReceita(menor != null ? menor.getTotalLiquido() : BigDecimal.ZERO)
                                .build();
        }

        private List<PeriodoRelatorioInterno> gerarPeriodoAnual(int ano) {
                return List.of(
                                periodo("Ano " + ano, LocalDate.of(ano, 1, 1), LocalDate.of(ano, 12, 31)));
        }

        private BigDecimal calcularMedia(BigDecimal total, int quantidadePeriodos) {
                if (quantidadePeriodos <= 0) {
                        return BigDecimal.ZERO;
                }

                return total.divide(
                                BigDecimal.valueOf(quantidadePeriodos),
                                2,
                                RoundingMode.HALF_UP);
        }

        private BigDecimal somar(
                        List<RelatorioPeriodoResponse> periodos,
                        FunctionRelatorio mapper) {
                return periodos.stream()
                                .map(mapper::getValor)
                                .filter(valor -> valor != null)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        private List<PeriodoRelatorioInterno> gerarPeriodosSemestrais(int ano) {
                return List.of(
                                periodo("1º sem.", LocalDate.of(ano, 1, 1), LocalDate.of(ano, 6, 30)),
                                periodo("2º sem.", LocalDate.of(ano, 7, 1), LocalDate.of(ano, 12, 31)));
        }

        private String montarDescricao(TipoPeriodoRelatorio tipo, int ano) {
                String nome = switch (tipo) {
                        case ANUAL -> "Anual";
                        case SEMESTRAL -> "Semestral";
                        case TRIMESTRAL -> "Trimestral";
                        case MENSAL -> "Mensal";
                };

                return nome + " - " + ano;
        }

        @FunctionalInterface
        private interface FunctionRelatorio {
                BigDecimal getValor(RelatorioPeriodoResponse periodo);
        }

        @Getter
        @AllArgsConstructor
        private static class PeriodoRelatorioInterno {
                private String label;
                private LocalDate inicio;
                private LocalDate fim;
        }

        private RelatorioComparativoResponse montarComparativo(
        BigDecimal totalAtual,
        BigDecimal totalAnterior,
        int ensaiosAtual,
        int ensaiosAnterior,
        int anoComparado
) {
    BigDecimal percentualFaturamento = calcularPercentualVariacao(totalAtual, totalAnterior);
    int diferencaEnsaios = ensaiosAtual - ensaiosAnterior;

    return RelatorioComparativoResponse.builder()
            .anoComparado(anoComparado)
            .percentualFaturamento(percentualFaturamento)
            .diferencaEnsaios(diferencaEnsaios)
            .descricaoFaturamento(montarDescricaoFaturamento(
                    percentualFaturamento,
                    totalAtual,
                    totalAnterior,
                    anoComparado
            ))
            .descricaoEnsaios(montarDescricaoEnsaios(diferencaEnsaios, anoComparado))
            .tendenciaFaturamento(resolverTendenciaPercentual(percentualFaturamento))
            .tendenciaEnsaios(resolverTendenciaNumero(diferencaEnsaios))
            .build();
}

private BigDecimal calcularPercentualVariacao(BigDecimal atual, BigDecimal anterior) {
    if (anterior == null || anterior.compareTo(BigDecimal.ZERO) == 0) {
        return null;
    }

    return atual.subtract(anterior)
            .multiply(BigDecimal.valueOf(100))
            .divide(anterior, 2, RoundingMode.HALF_UP);
}

private String montarDescricaoFaturamento(
        BigDecimal percentual,
        BigDecimal totalAtual,
        BigDecimal totalAnterior,
        int anoComparado
) {
    if (percentual == null) {
        if (totalAtual.compareTo(BigDecimal.ZERO) > 0 &&
                totalAnterior.compareTo(BigDecimal.ZERO) == 0) {
            return "Sem base em " + anoComparado;
        }

        return "Sem faturamento em " + anoComparado;
    }

    if (percentual.compareTo(BigDecimal.ZERO) == 0) {
        return "Sem variação vs " + anoComparado;
    }

    BigDecimal percentualFormatado = percentual.abs().setScale(0, RoundingMode.HALF_UP);

    if (percentual.compareTo(BigDecimal.ZERO) > 0) {
        return "↑ +" + percentualFormatado + "% vs " + anoComparado;
    }

    return "↓ -" + percentualFormatado + "% vs " + anoComparado;
}

private String montarDescricaoEnsaios(int diferencaEnsaios, int anoComparado) {
    if (diferencaEnsaios > 0) {
        return "↑ " + diferencaEnsaios + " a mais que " + anoComparado;
    }

    if (diferencaEnsaios < 0) {
        return "↓ " + Math.abs(diferencaEnsaios) + " a menos que " + anoComparado;
    }

    return "Igual a " + anoComparado;
}

private String resolverTendenciaPercentual(BigDecimal percentual) {
    if (percentual == null) {
        return "SEM_BASE";
    }

    if (percentual.compareTo(BigDecimal.ZERO) > 0) {
        return "ALTA";
    }

    if (percentual.compareTo(BigDecimal.ZERO) < 0) {
        return "QUEDA";
    }

    return "NEUTRO";
}

private String resolverTendenciaNumero(int valor) {
    if (valor > 0) {
        return "ALTA";
    }

    if (valor < 0) {
        return "QUEDA";
    }

    return "NEUTRO";
}

private String resolverUnidadePeriodo(TipoPeriodoRelatorio tipo) {
    return switch (tipo) {
        case ANUAL -> "ano";
        case SEMESTRAL -> "semestre";
        case TRIMESTRAL -> "trimestre";
        case MENSAL -> "mês";
    };
}
}