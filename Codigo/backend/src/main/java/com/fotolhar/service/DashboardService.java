package com.fotolhar.service;

import com.fotolhar.dto.DashboardAtencaoResponse;
import com.fotolhar.dto.DashboardEnsaioResumoResponse;
import com.fotolhar.dto.DashboardResumoResponse;
import com.fotolhar.enums.StatusEnsaio;
import com.fotolhar.enums.TipoEnsaio;
import com.fotolhar.model.Album;
import com.fotolhar.model.Ensaio;
import com.fotolhar.model.Foto;
import com.fotolhar.model.Fotografa;
import com.fotolhar.repository.AlbumRepository;
import com.fotolhar.repository.EnsaioRepository;
import com.fotolhar.repository.FotoRepository;
import com.fotolhar.repository.PreferenciasSistemaRepository;
import com.fotolhar.repository.SelecaoFotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EnsaioRepository ensaioRepository;
    private final FotoRepository fotoRepository;
    private final AlbumRepository albumRepository;
    private final SelecaoFotoRepository selecaoFotoRepository;
    private final PreferenciasSistemaRepository preferenciasSistemaRepository;
    private final FotografaContextService fotografaContextService;

    @Transactional(readOnly = true)
    public DashboardResumoResponse buscarResumo() {
        Fotografa fotografa = fotografaContextService.getFotografaLogada();
        List<Ensaio> ensaios = ensaioRepository.findByClienteFotografaId(fotografa.getId());
        Map<UUID, Album> albumPorEnsaio = buscarAlbunsPorEnsaio(fotografa);

        OffsetDateTime agora = OffsetDateTime.now();
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

        int ensaiosHoje = contarEnsaiosHoje(ensaios, agora);
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

        List<Ensaio> ensaiosAtivos = ensaios.stream()
                .filter(this::isEnsaioEmAndamento)
                .sorted(Comparator.comparing(
                        Ensaio::getAtualizadoEm,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .toList();

        List<DashboardEnsaioResumoResponse> ensaiosEmAndamento = ensaiosAtivos.stream()
                .limit(6)
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
                .agendaProxima(agendaProxima)
                .proximosEnsaios(proximosEnsaios)
                .ensaiosEmAndamento(ensaiosEmAndamento)
                .ultimasAtualizacoes(ultimasAtualizacoes)
                .atencaoNecessaria(atencaoNecessaria)
                .build();
    }

    private Map<UUID, Album> buscarAlbunsPorEnsaio(Fotografa fotografa) {
        return albumRepository.findByEnsaioClienteFotografaId(fotografa.getId())
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
                .filter(ensaio -> ensaio.getDataEnsaio().toLocalDate().equals(agora.toLocalDate()))
                .count();
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
        OffsetDateTime agora = OffsetDateTime.now();

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
        }

        return itens.stream()
                .sorted(Comparator.comparing(
                        DashboardAtencaoResponse::getDataReferencia,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .limit(6)
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
        Fotografa fotografa = fotografaContextService.getFotografaLogada();

        return preferenciasSistemaRepository.findByFotografaId(fotografa.getId())
                .map(preferencias -> preferencias.getCapaAlbumPadraoUrl())
                .orElse(null);
    }
}
