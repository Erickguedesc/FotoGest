package com.olhari.service;

import com.olhari.dto.EnsaioRequest;
import com.olhari.dto.EnsaioResponse;
import com.olhari.dto.EnsaioStatusRequest;
import com.olhari.enums.StatusEnsaio;
import com.olhari.model.Cliente;
import com.olhari.model.Ensaio;
import com.olhari.model.Foto;
import com.olhari.repository.ClienteRepository;
import com.olhari.repository.EnsaioRepository;
import com.olhari.repository.FotoRepository;
import com.olhari.repository.PreferenciasSistemaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
// Adiciona esse import no topo
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import com.olhari.enums.TipoEnsaio;
import com.olhari.specification.EnsaioSpecification;
import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class EnsaioService {

    private final EnsaioRepository ensaioRepository;
    private final ClienteRepository clienteRepository;
    private final FotoRepository fotoRepository;
    private final PreferenciasSistemaRepository preferenciasSistemaRepository;
    private final EmailService emailService;

    
    

    @Transactional
    public EnsaioResponse criar(EnsaioRequest request) {
        Cliente cliente = buscarCliente(request.getClienteId());
        atualizarDadosCliente(cliente, request);
        

boolean cobrar = Boolean.TRUE.equals(request.getCobrarFotoExtra());

    if (cobrar && (request.getValorFotoExtra() == null ||
            request.getValorFotoExtra().compareTo(BigDecimal.ZERO) <= 0)) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Informe o valor da foto extra quando cobrar_foto_extra for true"
        );
    }


    // Logo após a validação do cobrarFotoExtra, adicionar:
if (request.getValorPacote() == null || 
    request.getValorPacote().compareTo(BigDecimal.ZERO) <= 0) {
    throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST,
        "Informe o valor do pacote"
    );
}
Ensaio ensaio = Ensaio.builder()
        .cliente(cliente)
        .tipo(request.getTipo())
        .status(StatusEnsaio.AGENDADO)
        .dataEnsaio(request.getDataEnsaio())
        .local(request.getLocal())
        .qtdFotosPacote(request.getQtdFotosPacote())
        .valorPacote(request.getValorPacote())
        .cobrarFotoExtra(cobrar)
         .valorFotoExtra(cobrar ? request.getValorFotoExtra() : null)
        .valorFinalEnsaio(request.getValorFinalEnsaio())
        .statusValores(normalizarStatusValores(request.getStatusValores()))
        .observacaoValores(normalizarTexto(request.getObservacaoValores()))
        .observacoes(request.getObservacoes())
        .progresso(resolverProgresso(StatusEnsaio.AGENDADO))
        .build();

        return toResponse(ensaioRepository.save(ensaio));
    }
@Transactional(readOnly = true)
public List<EnsaioResponse> listar(
        StatusEnsaio status,
        TipoEnsaio tipo,
        OffsetDateTime dataInicio,
        OffsetDateTime dataFim,
        String clienteNome
) {
    return ensaioRepository.findAll(
            EnsaioSpecification.filtrar(status, tipo, dataInicio, dataFim, clienteNome))
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
}

    @Transactional(readOnly = true)
    public EnsaioResponse buscarPorId(UUID id) {
        return toResponse(buscarEnsaio(id));
    }

    @Transactional
    public EnsaioResponse atualizar(UUID id, EnsaioRequest request) {
        Ensaio ensaio = buscarEnsaio(id);
        Cliente cliente = buscarCliente(request.getClienteId());
        atualizarDadosCliente(cliente, request);

        ensaio.setCliente(cliente);
        ensaio.setTipo(request.getTipo());
        ensaio.setDataEnsaio(request.getDataEnsaio());
        ensaio.setLocal(request.getLocal());
        // ✅ Direto — @NotNull no DTO já protege
         ensaio.setQtdFotosPacote(request.getQtdFotosPacote());
        ensaio.setValorPacote(request.getValorPacote());
        ensaio.setObservacoes(request.getObservacoes()); 
       
boolean cobrar = Boolean.TRUE.equals(request.getCobrarFotoExtra());
if (cobrar && (request.getValorFotoExtra() == null ||
        request.getValorFotoExtra().compareTo(BigDecimal.ZERO) <= 0)) {
    throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST,
        "Informe o valor da foto extra quando cobrar_foto_extra for true"
    );
}

if (request.getValorPacote() == null || 
    request.getValorPacote().compareTo(BigDecimal.ZERO) <= 0) {
    throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST,
        "Informe o valor do pacote"
    );
}
ensaio.setCobrarFotoExtra(cobrar);
ensaio.setValorFotoExtra(cobrar ? request.getValorFotoExtra() : null);
ensaio.setValorFinalEnsaio(request.getValorFinalEnsaio());
ensaio.setStatusValores(normalizarStatusValores(request.getStatusValores()));
ensaio.setObservacaoValores(normalizarTexto(request.getObservacaoValores()));

        return toResponse(ensaioRepository.save(ensaio));
    }


@Transactional
public void deletar(UUID id) {
    Ensaio ensaio = buscarEnsaio(id);

    if (ensaio.getStatus() != StatusEnsaio.AGENDADO &&
        ensaio.getStatus() != StatusEnsaio.CANCELADO) {
        throw new IllegalStateException(
            "Ensaio só pode ser deletado se estiver AGENDADO ou CANCELADO. " +
            "Status atual: " + ensaio.getStatus()
        );
    }

    ensaioRepository.delete(ensaio);
}

    /**
     * PATCH /ensaios/{id}/status
     * Atualiza o status e recalcula o progresso automaticamente.
     */
    @Transactional
    public EnsaioResponse atualizarStatus(UUID id, EnsaioStatusRequest request) {
        Ensaio ensaio = buscarEnsaio(id);
        ensaio.setStatus(request.getStatus());
        ensaio.setProgresso(resolverProgresso(request.getStatus()));
        Ensaio salvo = ensaioRepository.save(ensaio);
        emailService.avisarStatusAlterado(salvo, request.getStatus());
        return toResponse(salvo);
    }

    // ── helpers ─────────────────────────────────────────────────────────────

    private Ensaio buscarEnsaio(UUID id) {
        return ensaioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ensaio não encontrado com id: " + id));
    }

    private Cliente buscarCliente(UUID clienteId) {
        return clienteRepository.findById(clienteId)
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado com id: " + clienteId));
    }

    /**
     * Regra de negócio: progresso automático por status.
     * AGENDADO=0 | REALIZADO=25 | EM_SELECAO=50 | EM_EDICAO=75 | FINALIZADO=100 | CANCELADO=0
     */
    private Short resolverProgresso(StatusEnsaio status) {
        return (short) switch (status) {
            case AGENDADO   -> 0;
            case REALIZADO  -> 25;
            case EM_SELECAO -> 50;
            case EM_EDICAO  -> 75;
            case FINALIZADO -> 100;
            case CANCELADO  -> 0;
        };
    }


    private void atualizarDadosCliente(Cliente cliente, EnsaioRequest request) {
    if (request.getClienteNome() != null && !request.getClienteNome().trim().isEmpty()) {
        cliente.setNome(request.getClienteNome().trim());
    }

    if (request.getClienteEmail() != null) {
        cliente.setEmail(normalizarTexto(request.getClienteEmail()));
    }

    if (request.getClienteTelefone() != null) {
        cliente.setTelefone(normalizarTexto(request.getClienteTelefone()));
    }

    if (request.getClienteCpf() != null) {
        cliente.setCpf(normalizarTexto(request.getClienteCpf()));
    }

    if (request.getClienteCidade() != null) {
        cliente.setCidade(normalizarTexto(request.getClienteCidade()));
    }

    if (request.getClienteIndicacao() != null) {
        cliente.setIndicacao(normalizarTexto(request.getClienteIndicacao()));
    }
}

private String normalizarTexto(String valor) {
    if (valor == null) return null;

    String texto = valor.trim();

    return texto.isEmpty() ? null : texto;
}

private String normalizarStatusValores(String valor) {
    String status = normalizarTexto(valor);

    if (status == null) {
        return "NAO_INFORMADO";
    }

    return status;
}

    private EnsaioResponse toResponse(Ensaio ensaio) {
    return EnsaioResponse.builder()
            .id(ensaio.getId())

            .clienteId(ensaio.getCliente().getId())
            .clienteNome(ensaio.getCliente().getNome())
            .clienteTelefone(ensaio.getCliente().getTelefone())
            .clienteEmail(ensaio.getCliente().getEmail())
            .clienteCpf(ensaio.getCliente().getCpf())
            .clienteCidade(ensaio.getCliente().getCidade())
            .clienteIndicacao(ensaio.getCliente().getIndicacao())

            .tipo(ensaio.getTipo())
            .status(ensaio.getStatus())
            .dataEnsaio(ensaio.getDataEnsaio())
            .local(ensaio.getLocal())

            .qtdFotosPacote(ensaio.getQtdFotosPacote())
            .valorPacote(ensaio.getValorPacote())
            .valorFotoExtra(ensaio.getValorFotoExtra())
            .cobrarFotoExtra(ensaio.getCobrarFotoExtra())
            .valorFinalEnsaio(ensaio.getValorFinalEnsaio())
            .statusValores(ensaio.getStatusValores())
            .observacaoValores(ensaio.getObservacaoValores())

            .observacoes(ensaio.getObservacoes())
            .progresso(ensaio.getProgresso())
            .totalFotos(fotoRepository.countByEnsaioId(ensaio.getId()))
            .capaUrl(buscarCapaUrl(ensaio.getId()))

            .criadoEm(ensaio.getCriadoEm())
            .atualizadoEm(ensaio.getAtualizadoEm())
            .build();
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
