package com.fotogest.service;

import com.fotogest.dto.DashboardAtencaoResponse;
import com.fotogest.dto.DashboardEnsaioResumoResponse;
import com.fotogest.dto.DashboardResumoResponse;
import com.fotogest.enums.StatusEnsaio;
import com.fotogest.model.Album;
import com.fotogest.model.Ensaio;
import com.fotogest.model.Foto;
import com.fotogest.repository.AlbumRepository;
import com.fotogest.repository.EnsaioRepository;
import com.fotogest.repository.FotoRepository;
import com.fotogest.repository.SelecaoFotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import com.fotogest.repository.PreferenciasSistemaRepository;
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EnsaioRepository ensaioRepository;
    private final FotoRepository fotoRepository;
    private final AlbumRepository albumRepository;
    private final SelecaoFotoRepository selecaoFotoRepository;
    private final PreferenciasSistemaRepository preferenciasSistemaRepository;

    @Transactional(readOnly = true)
    public DashboardResumoResponse buscarResumo() {
        List<Ensaio> ensaios = ensaioRepository.findAll();

        Map<UUID, Album> albumPorEnsaio = albumRepository.findAll()
                .stream()
                .filter(album -> album.getEnsaio() != null)
                .filter(album -> album.getEnsaio().getId() != null)
                .collect(Collectors.toMap(
                        album -> album.getEnsaio().getId(),
                        Function.identity(),
                        (albumExistente, albumNovo) -> albumExistente
                ));

        OffsetDateTime agora = OffsetDateTime.now();
        YearMonth mesAtual = YearMonth.from(agora);

        List<Ensaio> ensaiosEsteMes = ensaios.stream()
                .filter(ensaio -> pertenceAoMes(ensaio, mesAtual))
                .filter(ensaio -> ensaio.getStatus() != StatusEnsaio.CANCELADO)
                .toList();

        Map<UUID, Integer> totalSelecoesPorAlbum = albumPorEnsaio.values()
                .stream()
                .collect(Collectors.toMap(
                        Album::getId,
                        album -> selecaoFotoRepository.findByAlbumId(album.getId()).size()
                ));

        BigDecimal receitaEstimada = ensaiosEsteMes.stream()
                .map(ensaio -> calcularValorPrevistoDoEnsaio(
                        ensaio,
                        albumPorEnsaio,
                        totalSelecoesPorAlbum
                ))
                .filter(valor -> valor != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

     int selecoesEnviadas = (int) ensaios.stream()
        .filter(ensaio -> ensaio.getStatus() == StatusEnsaio.EM_SELECAO)
        .filter(ensaio -> temSelecaoEnviada(ensaio, albumPorEnsaio))
        .count();

        int ensaiosSemFotosEnviadas = (int) ensaios.stream()
                .filter(ensaio -> ensaio.getStatus() == StatusEnsaio.REALIZADO)
                .filter(ensaio -> fotoRepository.countByEnsaioId(ensaio.getId()) == 0)
                .count();

        int ensaiosFinalizadosMes = (int) ensaiosEsteMes.stream()
                .filter(ensaio -> ensaio.getStatus() == StatusEnsaio.FINALIZADO)
                .count();

        List<DashboardEnsaioResumoResponse> proximosEnsaios = ensaios.stream()
                .filter(ensaio -> ensaio.getStatus() == StatusEnsaio.AGENDADO)
                .filter(ensaio -> ensaio.getDataEnsaio() != null)
                .filter(ensaio -> !ensaio.getDataEnsaio().isBefore(agora))
                .sorted(Comparator.comparing(Ensaio::getDataEnsaio))
                .limit(3)
                .map(ensaio -> toEnsaioResumo(ensaio, albumPorEnsaio))
                .toList();

        List<DashboardEnsaioResumoResponse> ensaiosEmAndamento = ensaios.stream()
                .filter(this::isEnsaioEmAndamento)
                .sorted(Comparator.comparing(
                        Ensaio::getAtualizadoEm,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .limit(6)
                .map(ensaio -> toEnsaioResumo(ensaio, albumPorEnsaio))
                .toList();

        List<DashboardAtencaoResponse> atencaoNecessaria = montarAtencaoNecessaria(
                ensaios,
                albumPorEnsaio
        );

        return DashboardResumoResponse.builder()
                .ensaiosEsteMes(ensaiosEsteMes.size())
                .selecoesEnviadas(selecoesEnviadas)
                .ensaiosSemFotosEnviadas(ensaiosSemFotosEnviadas)
                .receitaEstimada(receitaEstimada)
                .ensaiosFinalizadosMes(ensaiosFinalizadosMes)
                .proximosEnsaios(proximosEnsaios)
                .ensaiosEmAndamento(ensaiosEmAndamento)
                .atencaoNecessaria(atencaoNecessaria)
                .build();
    }

    private List<DashboardAtencaoResponse> montarAtencaoNecessaria(
            List<Ensaio> ensaios,
            Map<UUID, Album> albumPorEnsaio
    ) {
        List<DashboardAtencaoResponse> itens = new ArrayList<>();

        for (Ensaio ensaio : ensaios) {
            int totalFotos = fotoRepository.countByEnsaioId(ensaio.getId());

            if (ensaio.getStatus() == StatusEnsaio.REALIZADO && totalFotos == 0) {
                itens.add(DashboardAtencaoResponse.builder()
                        .tipo("UPLOAD_PENDENTE")
                        .titulo("Ensaio realizado sem fotos")
                        .descricao("Ensaio realizado, upload pendente")
                        .ensaioId(ensaio.getId())
                        .clienteNome(ensaio.getCliente().getNome())
                        .dataReferencia(ensaio.getDataEnsaio())
                        .build());
            }
if (ensaio.getStatus() == StatusEnsaio.EM_SELECAO
        && temSelecaoEnviada(ensaio, albumPorEnsaio)) {

    itens.add(DashboardAtencaoResponse.builder()
            .tipo("SELECAO_ENVIADA")
            .titulo("Cliente com seleção enviada")
            .descricao("Revisar favoritas da cliente")
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
                .limit(6)
                .toList();
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

        int totalFotos = fotoRepository.countByEnsaioId(ensaioId);

        return DashboardEnsaioResumoResponse.builder()
                .id(ensaioId)
                .clienteNome(ensaio.getCliente().getNome())
                .tipo(ensaio.getTipo())
                .status(ensaio.getStatus())
                .dataEnsaio(ensaio.getDataEnsaio())
                .local(ensaio.getLocal())
                .progresso(ensaio.getProgresso())
                .valorPacote(ensaio.getValorPacote())
                .totalFotos(totalFotos)
                .capaUrl(buscarCapaUrl(ensaioId))
                .albumPublicado(albumPublicado)
                .selecaoEnviada(selecaoEnviada)
                .build();
    }

    private boolean pertenceAoMes(Ensaio ensaio, YearMonth mes) {
        if (ensaio.getDataEnsaio() == null) {
            return false;
        }

        return YearMonth.from(ensaio.getDataEnsaio()).equals(mes);
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
    return preferenciasSistemaRepository.findAll()
            .stream()
            .findFirst()
            .map(preferencias -> preferencias.getCapaAlbumPadraoUrl())
            .orElse(null);
}
}
