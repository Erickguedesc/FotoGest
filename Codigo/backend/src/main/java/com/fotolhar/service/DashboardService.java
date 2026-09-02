package com.fotolhar.service;

import com.fotolhar.dto.DashboardAtencaoResponse;
import com.fotolhar.dto.DashboardEnsaioResumoResponse;
import com.fotolhar.dto.DashboardFluxoEtapaResponse;
import com.fotolhar.dto.DashboardRegiaoDemandaResponse;
import com.fotolhar.dto.DashboardResumoResponse;
import com.fotolhar.dto.RelatorioTipoEnsaioResponse;
import com.fotolhar.enums.StatusEnsaio;
import com.fotolhar.enums.TipoEnsaio;
import com.fotolhar.enums.TipoPeriodoRelatorio;
import com.fotolhar.model.Album;
import com.fotolhar.model.Cliente;
import com.fotolhar.model.Ensaio;
import com.fotolhar.model.Foto;
import com.fotolhar.model.HistoricoStatusEnsaio;
import com.fotolhar.model.Usuario;
import com.fotolhar.repository.AlbumRepository;
import com.fotolhar.repository.ClienteRepository;
import com.fotolhar.repository.EnsaioRepository;
import com.fotolhar.repository.FotoRepository;
import com.fotolhar.repository.HistoricoStatusEnsaioRepository;
import com.fotolhar.repository.PreferenciasSistemaRepository;
import com.fotolhar.repository.SelecaoFotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final int DIAS_EDICAO_ATRASADA = 14;
    private static final int HISTORICO_RECENTE_DIAS = 180;
    private static final String RECEITA_PERIODO_PADRAO = "ESTE_MES";
    private static final ZoneId APP_ZONE = ZoneId.of("America/Sao_Paulo");

    private final EnsaioRepository ensaioRepository;
    private final ClienteRepository clienteRepository;
    private final FotoRepository fotoRepository;
    private final AlbumRepository albumRepository;
    private final HistoricoStatusEnsaioRepository historicoStatusEnsaioRepository;
    private final SelecaoFotoRepository selecaoFotoRepository;
    private final PreferenciasSistemaRepository preferenciasSistemaRepository;
    private final UsuarioContextService usuarioContextService;
    private final RelatorioService relatorioService;

    @Transactional(readOnly = true)
    public DashboardResumoResponse buscarResumo() {
        Usuario usuario = usuarioContextService.getUsuarioLogado();
        List<Ensaio> ensaios = ensaioRepository.findByClienteUsuarioId(usuario.getId());
        Map<UUID, Album> albumPorEnsaio = buscarAlbunsPorEnsaio(usuario);

        OffsetDateTime agora = agoraNoFusoDoApp();
        YearMonth mesAtual = YearMonth.from(agora);
        OffsetDateTime daquiSeteDias = agora.plusDays(7);

        long totalEnsaios = ensaios.stream()
                .filter(ensaio -> ensaio.getStatus() != StatusEnsaio.CANCELADO)
                .count();

        List<Ensaio> ensaiosEsteMes = ensaios.stream()
                .filter(ensaio -> pertenceAoMes(ensaio, mesAtual))
                .filter(ensaio -> ensaio.getStatus() != StatusEnsaio.CANCELADO)
                .toList();

        Map<UUID, Integer> totalSelecoesPorAlbum = contarSelecoesPorAlbum(albumPorEnsaio);

        BigDecimal receitaEstimada = ensaiosEsteMes.stream()
                .map(ensaio -> calcularValorPrevistoDoEnsaio(
                        ensaio,
                        albumPorEnsaio,
                        totalSelecoesPorAlbum
                ))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Ensaio> ensaiosDoDia = buscarEnsaiosDoDia(ensaios, agora);
        int ensaiosHoje = ensaiosDoDia.size();
        int selecoesEnviadas = contarSelecoesEnviadas(ensaios, albumPorEnsaio);
        int ensaiosSemFotosEnviadas = contarEnsaiosSemFotos(ensaios);
        int ensaiosFinalizadosMes = contarFinalizados(ensaiosEsteMes);

        List<Ensaio> ensaiosAgendadosFuturos = buscarEnsaiosAgendadosFuturos(ensaios, agora);

        List<DashboardEnsaioResumoResponse> proximosEnsaios = ensaiosAgendadosFuturos.stream()
                .limit(3)
                .map(ensaio -> toEnsaioResumo(ensaio, albumPorEnsaio))
                .toList();

        List<DashboardEnsaioResumoResponse> agendaProxima = ensaiosAgendadosFuturos.stream()
                .filter(ensaio -> !ensaio.getDataEnsaio().isAfter(daquiSeteDias))
                .limit(8)
                .map(ensaio -> toEnsaioResumo(ensaio, albumPorEnsaio))
                .toList();

        List<DashboardEnsaioResumoResponse> ensaiosDoDiaResumo = ensaiosDoDia.stream()
                .map(ensaio -> toEnsaioResumo(ensaio, albumPorEnsaio))
                .toList();

        List<Ensaio> ensaiosAtivos = ensaios.stream()
                .filter(this::isEnsaioEmAndamento)
                .sorted(Comparator.comparing(
                        Ensaio::getAtualizadoEm,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .toList();

        List<DashboardEnsaioResumoResponse> ensaiosEmAndamento = ensaiosAtivos.stream()
                .limit(8)
                .map(ensaio -> toEnsaioResumo(ensaio, albumPorEnsaio))
                .toList();

        List<DashboardEnsaioResumoResponse> ultimasAtualizacoes = ensaios.stream()
                .filter(ensaio -> ensaio.getStatus() != StatusEnsaio.CANCELADO)
                .sorted(Comparator.comparing(
                        Ensaio::getAtualizadoEm,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .limit(5)
                .map(ensaio -> toEnsaioResumo(ensaio, albumPorEnsaio))
                .toList();

        List<DashboardAtencaoResponse> atencaoNecessaria = montarAtencaoNecessaria(
                ensaios,
                albumPorEnsaio
        );

        return DashboardResumoResponse.builder()
                .ensaiosEsteMes(ensaiosEsteMes.size())
                .totalEnsaios((int) totalEnsaios)
                .ensaiosHoje(ensaiosHoje)
                .ensaiosProximosSeteDias(agendaProxima.size())
                .ensaiosEmAndamentoTotal(ensaiosAtivos.size())
                .selecoesEnviadas(selecoesEnviadas)
                .ensaiosSemFotosEnviadas(ensaiosSemFotosEnviadas)
                .pendenciasTotal(atencaoNecessaria.size())
                .receitaEstimada(receitaEstimada)
                .ensaiosFinalizadosMes(ensaiosFinalizadosMes)
                .pipelineStatus(montarPipelineStatus(ensaios))
                .proximoEnsaio(proximosEnsaios.isEmpty() ? null : proximosEnsaios.get(0))
                .ensaiosDoDia(ensaiosDoDiaResumo)
                .agendaProxima(agendaProxima)
                .proximosEnsaios(proximosEnsaios)
                .ensaiosEmAndamento(ensaiosEmAndamento)
                .ultimasAtualizacoes(ultimasAtualizacoes)
                .atencaoNecessaria(atencaoNecessaria)
                .desempenhoFluxo(montarDesempenhoFluxo(ensaios, albumPorEnsaio, agora))
                .regioesDemanda(montarRegioesDemanda(usuario))
                .receitaPorTipoEnsaio(buscarReceitaPorTipoEnsaio(RECEITA_PERIODO_PADRAO))
                .build();
    }

    private Map<UUID, Album> buscarAlbunsPorEnsaio(Usuario usuario) {
        return albumRepository.findByEnsaioClienteUsuarioId(usuario.getId())
                .stream()
                .filter(album -> album.getEnsaio() != null)
                .filter(album -> album.getEnsaio().getId() != null)
                .collect(Collectors.toMap(
                        album -> album.getEnsaio().getId(),
                        Function.identity(),
                        (albumExistente, albumNovo) -> albumExistente
                ));
    }

    private Map<UUID, Integer> contarSelecoesPorAlbum(Map<UUID, Album> albumPorEnsaio) {
        return albumPorEnsaio.values()
                .stream()
                .collect(Collectors.toMap(
                        Album::getId,
                        album -> selecaoFotoRepository.findByAlbumId(album.getId()).size()
                ));
    }

    private int contarEnsaiosHoje(List<Ensaio> ensaios, OffsetDateTime agora) {
        return (int) ensaios.stream()
                .filter(ensaio -> ensaio.getStatus() != StatusEnsaio.CANCELADO)
                .filter(ensaio -> ensaio.getDataEnsaio() != null)
                .filter(ensaio -> toAppLocalDate(ensaio.getDataEnsaio()).equals(agora.toLocalDate()))
                .count();
    }

    private List<Ensaio> buscarEnsaiosDoDia(List<Ensaio> ensaios, OffsetDateTime agora) {
        return ensaios.stream()
                .filter(ensaio -> ensaio.getStatus() != StatusEnsaio.CANCELADO)
                .filter(ensaio -> ensaio.getDataEnsaio() != null)
                .filter(ensaio -> toAppLocalDate(ensaio.getDataEnsaio()).equals(agora.toLocalDate()))
                .sorted(Comparator.comparing(Ensaio::getDataEnsaio))
                .toList();
    }

    private int contarSelecoesEnviadas(
            List<Ensaio> ensaios,
            Map<UUID, Album> albumPorEnsaio
    ) {
        return (int) ensaios.stream()
                .filter(ensaio -> ensaio.getStatus() == StatusEnsaio.EM_SELECAO)
                .filter(ensaio -> temSelecaoEnviada(ensaio, albumPorEnsaio))
                .count();
    }

    private int contarEnsaiosSemFotos(List<Ensaio> ensaios) {
        return (int) ensaios.stream()
                .filter(ensaio -> ensaio.getStatus() == StatusEnsaio.REALIZADO)
                .filter(ensaio -> fotoRepository.countByEnsaioId(ensaio.getId()) == 0)
                .count();
    }

    private int contarFinalizados(List<Ensaio> ensaios) {
        return (int) ensaios.stream()
                .filter(ensaio -> ensaio.getStatus() == StatusEnsaio.FINALIZADO)
                .count();
    }

    private List<DashboardFluxoEtapaResponse> montarDesempenhoFluxo(
            List<Ensaio> ensaios,
            Map<UUID, Album> albumPorEnsaio,
            OffsetDateTime agora
    ) {
        OffsetDateTime limiteRecente = agora.minusDays(HISTORICO_RECENTE_DIAS);
        List<BigDecimal> ensaioParaAlbum = new ArrayList<>();
        List<BigDecimal> albumParaSelecao = new ArrayList<>();
        List<BigDecimal> selecaoParaFinalizacao = new ArrayList<>();

        for (Ensaio ensaio : ensaios) {
            Album album = albumPorEnsaio.get(ensaio.getId());

            if (album == null) {
                continue;
            }

            adicionarDuracaoEmDias(
                    ensaioParaAlbum,
                    ensaio.getDataEnsaio(),
                    album.getPublicadoEm(),
                    limiteRecente
            );

            OffsetDateTime dataSelecao = buscarDataSelecao(album);

            adicionarDuracaoEmDias(
                    albumParaSelecao,
                    album.getPublicadoEm(),
                    dataSelecao,
                    limiteRecente
            );

            if (ensaio.getStatus() == StatusEnsaio.FINALIZADO) {
                OffsetDateTime dataFinalizacao = buscarUltimaDataStatus(ensaio, StatusEnsaio.FINALIZADO)
                        .orElse(ensaio.getAtualizadoEm());

                adicionarDuracaoEmDias(
                        selecaoParaFinalizacao,
                        dataSelecao,
                        dataFinalizacao,
                        limiteRecente
                );
            }
        }

        return List.of(
                montarEtapaFluxo("ENSAIO_ALBUM", "Ensaio → álbum", ensaioParaAlbum, false),
                montarEtapaFluxo("ALBUM_SELECAO", "Álbum → seleção", albumParaSelecao, true),
                montarEtapaFluxo("SELECAO_FINALIZACAO", "Seleção → finalização", selecaoParaFinalizacao, true)
        );
    }

    private DashboardFluxoEtapaResponse montarEtapaFluxo(
            String chave,
            String titulo,
            List<BigDecimal> duracoes,
            boolean parcial
    ) {
        return DashboardFluxoEtapaResponse.builder()
                .chave(chave)
                .titulo(titulo)
                .mediaDias(calcularMediaDias(duracoes))
                .quantidadeAmostras(duracoes.size())
                .parcial(parcial)
                .build();
    }

    private void adicionarDuracaoEmDias(
            List<BigDecimal> duracoes,
            OffsetDateTime inicio,
            OffsetDateTime fim,
            OffsetDateTime limiteRecente
    ) {
        if (inicio == null || fim == null || fim.isBefore(inicio) || fim.isBefore(limiteRecente)) {
            return;
        }

        long minutos = Duration.between(inicio, fim).toMinutes();

        duracoes.add(BigDecimal.valueOf(minutos)
                .divide(BigDecimal.valueOf(1440), 4, RoundingMode.HALF_UP));
    }

    private BigDecimal calcularMediaDias(List<BigDecimal> duracoes) {
        if (duracoes.isEmpty()) {
            return null;
        }

        BigDecimal total = duracoes.stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return total.divide(BigDecimal.valueOf(duracoes.size()), 1, RoundingMode.HALF_UP);
    }

    private OffsetDateTime buscarDataSelecao(Album album) {
        return selecaoFotoRepository.findByAlbumId(album.getId())
                .stream()
                .map(selecao -> selecao.getSelecionadaEm())
                .filter(data -> data != null)
                .max(OffsetDateTime::compareTo)
                .orElse(null);
    }

    private java.util.Optional<OffsetDateTime> buscarUltimaDataStatus(
            Ensaio ensaio,
            StatusEnsaio status
    ) {
        return historicoStatusEnsaioRepository
                .findByEnsaioIdOrderByAlteradoEmAsc(ensaio.getId())
                .stream()
                .filter(item -> item.getStatus() == status)
                .map(HistoricoStatusEnsaio::getAlteradoEm)
                .filter(data -> data != null)
                .max(OffsetDateTime::compareTo);
    }

    private List<DashboardRegiaoDemandaResponse> montarRegioesDemanda(Usuario usuario) {
        Map<String, RegiaoClienteResumo> contagens = new LinkedHashMap<>();

        clienteRepository.findByUsuarioIdOrderByNomeAsc(usuario.getId())
                .stream()
                .filter(cliente -> cliente.getId() != null)
                .collect(Collectors.toMap(
                        Cliente::getId,
                        Function.identity(),
                        (clienteExistente, clienteDuplicado) -> clienteExistente
                ))
                .values()
                .forEach(cliente -> {
                    String cidade = normalizarCidadeCliente(cliente.getCidade());

                    if (cidade == null) {
                        return;
                    }

                    String chave = cidade.toLowerCase(Locale.ROOT);
                    RegiaoClienteResumo resumo = contagens.computeIfAbsent(
                            chave,
                            ignored -> new RegiaoClienteResumo(cidade)
                    );

                    resumo.incrementar();
                });

        int totalValido = contagens.values()
                .stream()
                .map(RegiaoClienteResumo::getQuantidadeClientes)
                .reduce(0, Integer::sum);

        if (totalValido == 0) {
            return List.of();
        }

        return contagens.values()
                .stream()
                .sorted(Comparator
                        .comparing(RegiaoClienteResumo::getQuantidadeClientes)
                        .reversed()
                        .thenComparing(RegiaoClienteResumo::getRegiao))
                .map(resumo -> DashboardRegiaoDemandaResponse.builder()
                        .regiao(resumo.getRegiao())
                        .quantidadeClientes(resumo.getQuantidadeClientes())
                        .percentual(calcularPercentual(resumo.getQuantidadeClientes(), totalValido))
                        .build())
                .toList();
    }

    private String normalizarCidadeCliente(String valor) {
        if (valor == null) {
            return null;
        }

        String texto = valor.trim().replaceAll("\\s+", " ");

        if (texto.length() < 2 || !texto.matches(".*\\p{L}.*")) {
            return null;
        }

        return texto;
    }

    private BigDecimal calcularPercentual(int quantidade, int total) {
        if (total <= 0) {
            return BigDecimal.ZERO;
        }

        return BigDecimal.valueOf(quantidade)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(total), 1, RoundingMode.HALF_UP);
    }

    public List<RelatorioTipoEnsaioResponse> buscarReceitaPorTipoEnsaio(String periodo) {
        ReceitaPeriodoRange intervalo = resolverPeriodoReceita(periodo);
        List<RelatorioTipoEnsaioResponse> tipos = relatorioService
                .buscarFaturamento(
                        TipoPeriodoRelatorio.MENSAL,
                        intervalo.getInicio().getYear(),
                        intervalo.getInicio(),
                        intervalo.getFim()
                )
                .getTiposEnsaio();

        if (tipos == null) {
            return List.of();
        }

        return tipos
                .stream()
                .toList();
    }

    private ReceitaPeriodoRange resolverPeriodoReceita(String periodo) {
        String periodoNormalizado = periodo == null || periodo.isBlank()
                ? RECEITA_PERIODO_PADRAO
                : periodo.trim().toUpperCase(Locale.ROOT);
        YearMonth mesAtual = YearMonth.now(APP_ZONE);

        return switch (periodoNormalizado) {
            case "MES_PASSADO" -> {
                YearMonth mesPassado = mesAtual.minusMonths(1);
                yield new ReceitaPeriodoRange(mesPassado.atDay(1), mesPassado.atEndOfMonth());
            }
            case "ULTIMOS_3_MESES" -> {
                YearMonth primeiroMes = mesAtual.minusMonths(2);
                yield new ReceitaPeriodoRange(primeiroMes.atDay(1), mesAtual.atEndOfMonth());
            }
            case "ESTE_SEMESTRE" -> {
                int mesInicial = mesAtual.getMonthValue() <= 6 ? 1 : 7;
                int mesFinal = mesInicial == 1 ? 6 : 12;
                yield new ReceitaPeriodoRange(
                        LocalDate.of(mesAtual.getYear(), mesInicial, 1),
                        YearMonth.of(mesAtual.getYear(), mesFinal).atEndOfMonth()
                );
            }
            case "ESTE_ANO" -> new ReceitaPeriodoRange(
                    LocalDate.of(mesAtual.getYear(), 1, 1),
                    LocalDate.of(mesAtual.getYear(), 12, 31)
            );
            case "ESTE_MES" -> new ReceitaPeriodoRange(mesAtual.atDay(1), mesAtual.atEndOfMonth());
            default -> new ReceitaPeriodoRange(mesAtual.atDay(1), mesAtual.atEndOfMonth());
        };
    }

    private List<Ensaio> buscarEnsaiosAgendadosFuturos(
            List<Ensaio> ensaios,
            OffsetDateTime agora
    ) {
        return ensaios.stream()
                .filter(ensaio -> ensaio.getStatus() == StatusEnsaio.AGENDADO)
                .filter(ensaio -> ensaio.getDataEnsaio() != null)
                .filter(ensaio -> !ensaio.getDataEnsaio().isBefore(agora))
                .sorted(Comparator.comparing(Ensaio::getDataEnsaio))
                .toList();
    }

    private List<DashboardAtencaoResponse> montarAtencaoNecessaria(
            List<Ensaio> ensaios,
            Map<UUID, Album> albumPorEnsaio
    ) {
        List<DashboardAtencaoResponse> itens = new ArrayList<>();
        OffsetDateTime agora = agoraNoFusoDoApp();

        for (Ensaio ensaio : ensaios) {
            int totalFotos = fotoRepository.countByEnsaioId(ensaio.getId());
            Album album = albumPorEnsaio.get(ensaio.getId());
            boolean albumPublicado = album != null
                    && Boolean.TRUE.equals(album.getAtivo())
                    && Boolean.TRUE.equals(album.getAcessoLiberado());

            if (
                    ensaio.getStatus() == StatusEnsaio.AGENDADO
                    && ensaio.getDataEnsaio() != null
                    && ensaio.getDataEnsaio().isBefore(agora)
            ) {
                itens.add(DashboardAtencaoResponse.builder()
                        .tipo("ENSAIO_ATRASADO")
                        .titulo("Ensaio com data passada")
                        .descricao("Atualizar o status do ensaio")
                        .ensaioId(ensaio.getId())
                        .clienteNome(ensaio.getCliente().getNome())
                        .dataReferencia(ensaio.getDataEnsaio())
                        .build());
            }

            if (ensaio.getStatus() == StatusEnsaio.REALIZADO && totalFotos == 0) {
                itens.add(DashboardAtencaoResponse.builder()
                        .tipo("UPLOAD_PENDENTE")
                        .titulo("Ensaio realizado sem fotos")
                        .descricao("Upload de fotos pendente")
                        .ensaioId(ensaio.getId())
                        .clienteNome(ensaio.getCliente().getNome())
                        .dataReferencia(ensaio.getDataEnsaio())
                        .build());
            }

            if (ensaio.getStatus() == StatusEnsaio.REALIZADO && totalFotos > 0 && !albumPublicado) {
                itens.add(DashboardAtencaoResponse.builder()
                        .tipo("ALBUM_PENDENTE")
                        .titulo("Album ainda não publicado")
                        .descricao("Fotos enviadas aguardando publicação")
                        .ensaioId(ensaio.getId())
                        .clienteNome(ensaio.getCliente().getNome())
                        .dataReferencia(ensaio.getAtualizadoEm())
                        .build());
            }

            if (ensaio.getStatus() == StatusEnsaio.EM_SELECAO
                    && temSelecaoEnviada(ensaio, albumPorEnsaio)) {
                itens.add(DashboardAtencaoResponse.builder()
                        .tipo("SELECAO_ENVIADA")
                        .titulo("Cliente com selecao enviada")
                        .descricao("Revisar favoritas da cliente")
                        .ensaioId(ensaio.getId())
                        .clienteNome(ensaio.getCliente().getNome())
                        .dataReferencia(ensaio.getAtualizadoEm())
                        .build());
            }

            if (ensaio.getStatus() == StatusEnsaio.EM_EDICAO) {
                OffsetDateTime desde = buscarDataStatusAtual(ensaio);
                long diasEmEdicao = desde == null ? 0 : Duration.between(desde, agora).toDays();

                if (diasEmEdicao >= DIAS_EDICAO_ATRASADA) {
                    itens.add(DashboardAtencaoResponse.builder()
                            .tipo("ENTREGA_ATRASADA")
                            .titulo("Edição atrasada")
                            .descricao("Ensaio em edição há " + diasEmEdicao + " dias")
                            .ensaioId(ensaio.getId())
                            .clienteNome(ensaio.getCliente().getNome())
                            .dataReferencia(desde)
                            .build());
                }
            }

            if (ensaio.getStatus() == StatusEnsaio.FINALIZADO
                    && ensaio.getStatusValores() != null
                    && "PENDENTE".equalsIgnoreCase(ensaio.getStatusValores())) {
                itens.add(DashboardAtencaoResponse.builder()
                        .tipo("PAGAMENTO_PENDENTE")
                        .titulo("Pagamento pendente")
                        .descricao("Entrega finalizada com valores pendentes")
                        .ensaioId(ensaio.getId())
                        .clienteNome(ensaio.getCliente().getNome())
                        .dataReferencia(ensaio.getAtualizadoEm())
                        .build());
            }
        }

        return itens.stream()
                .sorted(Comparator.comparing(
                        DashboardAtencaoResponse::getDataReferencia,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .toList();
    }

    private Map<String, Integer> montarPipelineStatus(List<Ensaio> ensaios) {
        Map<String, Integer> pipeline = new LinkedHashMap<>();

        Arrays.stream(StatusEnsaio.values())
                .forEach(status -> pipeline.put(status.name(), 0));

        ensaios.stream()
                .filter(ensaio -> ensaio.getStatus() != null)
                .forEach(ensaio -> pipeline.computeIfPresent(
                        ensaio.getStatus().name(),
                        (status, total) -> total + 1
                ));

        return pipeline;
    }

    private DashboardEnsaioResumoResponse toEnsaioResumo(
            Ensaio ensaio,
            Map<UUID, Album> albumPorEnsaio
    ) {
        UUID ensaioId = ensaio.getId();

        Album album = albumPorEnsaio.get(ensaioId);
        boolean albumPublicado = album != null
                && Boolean.TRUE.equals(album.getAtivo())
                && Boolean.TRUE.equals(album.getAcessoLiberado());
        boolean selecaoEnviada = album != null
                && selecaoFotoRepository.existsByAlbumId(album.getId());

        return DashboardEnsaioResumoResponse.builder()
                .id(ensaioId)
                .clienteNome(ensaio.getCliente().getNome())
                .tipo(ensaio.getTipo())
                .tipoPersonalizado(ensaio.getTipoPersonalizado())
                .tipoExibicao(resolverTipoExibicao(ensaio))
                .status(ensaio.getStatus())
                .dataEnsaio(ensaio.getDataEnsaio())
                .atualizadoEm(ensaio.getAtualizadoEm())
                .local(ensaio.getLocal())
                .progresso(ensaio.getProgresso())
                .valorPacote(ensaio.getValorPacote())
                .totalFotos(fotoRepository.countByEnsaioId(ensaioId))
                .capaUrl(buscarCapaUrl(ensaioId))
                .albumPublicado(albumPublicado)
                .selecaoEnviada(selecaoEnviada)
                .build();
    }

    private String resolverTipoExibicao(Ensaio ensaio) {
        if (ensaio == null || ensaio.getTipo() == null) {
            return null;
        }

        if (ensaio.getTipo() == TipoEnsaio.OUTRO
                && ensaio.getTipoPersonalizado() != null
                && !ensaio.getTipoPersonalizado().isBlank()) {
            return ensaio.getTipoPersonalizado().trim();
        }

        return ensaio.getTipo().getDescricao();
    }

    private boolean pertenceAoMes(Ensaio ensaio, YearMonth mes) {
        if (ensaio.getDataEnsaio() == null) {
            return false;
        }

        return YearMonth.from(ensaio.getDataEnsaio().atZoneSameInstant(APP_ZONE)).equals(mes);
    }

    private OffsetDateTime agoraNoFusoDoApp() {
        return OffsetDateTime.now(APP_ZONE);
    }

    private java.time.LocalDate toAppLocalDate(OffsetDateTime data) {
        return data.atZoneSameInstant(APP_ZONE).toLocalDate();
    }

    private boolean isEnsaioEmAndamento(Ensaio ensaio) {
        return ensaio.getStatus() == StatusEnsaio.REALIZADO
                || ensaio.getStatus() == StatusEnsaio.EM_SELECAO
                || ensaio.getStatus() == StatusEnsaio.EM_EDICAO;
    }

    private BigDecimal calcularValorPrevistoDoEnsaio(
            Ensaio ensaio,
            Map<UUID, Album> albumPorEnsaio,
            Map<UUID, Integer> totalSelecoesPorAlbum
    ) {
        if (ensaio.getValorFinalEnsaio() != null) {
            return ensaio.getValorFinalEnsaio();
        }

        BigDecimal valorPacote = ensaio.getValorPacote() == null
                ? BigDecimal.ZERO
                : ensaio.getValorPacote();

        return valorPacote.add(calcularValorExcedenteDoEnsaio(
                ensaio,
                albumPorEnsaio,
                totalSelecoesPorAlbum
        ));
    }

    private BigDecimal calcularValorExcedenteDoEnsaio(
            Ensaio ensaio,
            Map<UUID, Album> albumPorEnsaio,
            Map<UUID, Integer> totalSelecoesPorAlbum
    ) {
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

    private boolean temSelecaoEnviada(
            Ensaio ensaio,
            Map<UUID, Album> albumPorEnsaio
    ) {
        Album album = albumPorEnsaio.get(ensaio.getId());

        return album != null && selecaoFotoRepository.existsByAlbumId(album.getId());
    }

    private OffsetDateTime buscarDataStatusAtual(Ensaio ensaio) {
        List<HistoricoStatusEnsaio> historico = historicoStatusEnsaioRepository
                .findByEnsaioIdOrderByAlteradoEmAsc(ensaio.getId());

        return historico.stream()
                .filter(item -> item.getStatus() == ensaio.getStatus())
                .map(HistoricoStatusEnsaio::getAlteradoEm)
                .filter(data -> data != null)
                .max(OffsetDateTime::compareTo)
                .orElse(ensaio.getAtualizadoEm());
    }

    private String buscarCapaUrl(UUID ensaioId) {
        List<Foto> fotos = fotoRepository.findByEnsaioIdOrderByOrdemAscEnviadaEmAsc(ensaioId);

        if (fotos.isEmpty()) {
            return buscarCapaAlbumPadrao();
        }

        Foto capa = fotos.stream()
                .filter(foto -> Boolean.TRUE.equals(foto.getEhCapa()))
                .findFirst()
                .orElse(fotos.get(0));

        if (capa.getUrlWatermark() != null && !capa.getUrlWatermark().isBlank()) {
            return capa.getUrlWatermark();
        }

        if (capa.getUrlOriginal() != null && !capa.getUrlOriginal().isBlank()) {
            return capa.getUrlOriginal();
        }

        return buscarCapaAlbumPadrao();
    }

    private String buscarCapaAlbumPadrao() {
        Usuario usuario = usuarioContextService.getUsuarioLogado();

        return preferenciasSistemaRepository.findByUsuarioId(usuario.getId())
                .map(preferencias -> preferencias.getCapaAlbumPadraoUrl())
                .orElse(null);
    }

    private static class RegiaoClienteResumo {
        private final String regiao;
        private int quantidadeClientes;

        private RegiaoClienteResumo(String regiao) {
            this.regiao = regiao;
        }

        private void incrementar() {
            quantidadeClientes++;
        }

        private String getRegiao() {
            return regiao;
        }

        private int getQuantidadeClientes() {
            return quantidadeClientes;
        }
    }

    private static class ReceitaPeriodoRange {
        private final LocalDate inicio;
        private final LocalDate fim;

        private ReceitaPeriodoRange(LocalDate inicio, LocalDate fim) {
            this.inicio = inicio;
            this.fim = fim;
        }

        private LocalDate getInicio() {
            return inicio;
        }

        private LocalDate getFim() {
            return fim;
        }
    }
}
