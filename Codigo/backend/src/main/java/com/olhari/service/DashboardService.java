package com.olhari.service;

import com.olhari.dto.DashboardAtencaoResponse;
import com.olhari.dto.DashboardEnsaioResumoResponse;
import com.olhari.dto.DashboardResumoResponse;
import com.olhari.dto.DashboardSolicitacaoResumoResponse;
import com.olhari.enums.StatusEnsaio;
import com.olhari.enums.StatusLead;
import com.olhari.model.Album;
import com.olhari.model.Ensaio;
import com.olhari.model.Foto;
import com.olhari.model.SolicitacaoOrcamento;
import com.olhari.repository.AlbumRepository;
import com.olhari.repository.EnsaioRepository;
import com.olhari.repository.FotoRepository;
import com.olhari.repository.SelecaoFotoRepository;
import com.olhari.repository.SolicitacaoRepository;
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

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EnsaioRepository ensaioRepository;
    private final FotoRepository fotoRepository;
    private final AlbumRepository albumRepository;
    private final SelecaoFotoRepository selecaoFotoRepository;
    private final SolicitacaoRepository solicitacaoRepository;

    @Transactional(readOnly = true)
    public DashboardResumoResponse buscarResumo() {
        List<Ensaio> ensaios = ensaioRepository.findAll();
        List<SolicitacaoOrcamento> solicitacoes = solicitacaoRepository.findAll();

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

        BigDecimal receitaEstimada = ensaiosEsteMes.stream()
                .map(Ensaio::getValorPacote)
                .filter(valor -> valor != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int selecoesEnviadas = (int) ensaios.stream()
                .filter(ensaio -> temSelecaoEnviada(ensaio, albumPorEnsaio))
                .filter(ensaio -> ensaio.getStatus() != StatusEnsaio.FINALIZADO)
                .filter(ensaio -> ensaio.getStatus() != StatusEnsaio.CANCELADO)
                .count();

        int ensaiosSemFotosEnviadas = (int) ensaios.stream()
                .filter(ensaio -> ensaio.getStatus() == StatusEnsaio.REALIZADO)
                .filter(ensaio -> fotoRepository.countByEnsaioId(ensaio.getId()) == 0)
                .count();

        int ensaiosFinalizadosMes = (int) ensaiosEsteMes.stream()
                .filter(ensaio -> ensaio.getStatus() == StatusEnsaio.FINALIZADO)
                .count();

        int solicitacoesRecebidasMes = (int) solicitacoes.stream()
                .filter(solicitacao -> solicitacao.getRecebidoEm() != null)
                .filter(solicitacao -> YearMonth.from(solicitacao.getRecebidoEm()).equals(mesAtual))
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
                solicitacoes,
                albumPorEnsaio
        );

        List<DashboardSolicitacaoResumoResponse> solicitacoesRecentes = solicitacoes.stream()
                .sorted(Comparator.comparing(
                        SolicitacaoOrcamento::getRecebidoEm,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .limit(5)
                .map(this::toSolicitacaoResumo)
                .toList();

        return DashboardResumoResponse.builder()
                .ensaiosEsteMes(ensaiosEsteMes.size())
                .selecoesEnviadas(selecoesEnviadas)
                .ensaiosSemFotosEnviadas(ensaiosSemFotosEnviadas)
                .receitaEstimada(receitaEstimada)
                .ensaiosFinalizadosMes(ensaiosFinalizadosMes)
                .solicitacoesRecebidasMes(solicitacoesRecebidasMes)
                .proximosEnsaios(proximosEnsaios)
                .ensaiosEmAndamento(ensaiosEmAndamento)
                .atencaoNecessaria(atencaoNecessaria)
                .solicitacoesRecentes(solicitacoesRecentes)
                .build();
    }

    private List<DashboardAtencaoResponse> montarAtencaoNecessaria(
            List<Ensaio> ensaios,
            List<SolicitacaoOrcamento> solicitacoes,
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

            if (temSelecaoEnviada(ensaio, albumPorEnsaio)
                    && ensaio.getStatus() != StatusEnsaio.FINALIZADO
                    && ensaio.getStatus() != StatusEnsaio.CANCELADO) {

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

        solicitacoes.stream()
                .filter(solicitacao -> solicitacao.getStatusLead() == StatusLead.EM_SOLICITACAO)
                .sorted(Comparator.comparing(
                        SolicitacaoOrcamento::getRecebidoEm,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .limit(3)
                .forEach(solicitacao -> itens.add(DashboardAtencaoResponse.builder()
                        .tipo("SOLICITACAO_PENDENTE")
                        .titulo("Solicitação aguardando atendimento")
                        .descricao("Cliente aguardando retorno pelo WhatsApp")
                        .solicitacaoId(solicitacao.getId())
                        .clienteNome(solicitacao.getNomeCliente())
                        .dataReferencia(solicitacao.getRecebidoEm())
                        .build()));

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

    private DashboardSolicitacaoResumoResponse toSolicitacaoResumo(SolicitacaoOrcamento solicitacao) {
        return DashboardSolicitacaoResumoResponse.builder()
                .id(solicitacao.getId())
                .nomeCliente(solicitacao.getNomeCliente())
                .whatsapp(solicitacao.getWhatsapp())
                .tipoEnsaio(solicitacao.getTipoEnsaio())
                .dataDesejada(solicitacao.getDataDesejada())
                .statusLead(solicitacao.getStatusLead())
                .recebidoEm(solicitacao.getRecebidoEm())
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
            return null;
        }

        Foto capa = fotos.stream()
                .filter(foto -> Boolean.TRUE.equals(foto.getEhCapa()))
                .findFirst()
                .orElse(fotos.get(0));

        if (capa.getUrlWatermark() != null && !capa.getUrlWatermark().isBlank()) {
            return capa.getUrlWatermark();
        }

        return capa.getUrlOriginal();
    }
}