package com.olhari.service;

import com.olhari.dto.EnsaioRequest;
import com.olhari.dto.EnsaioResponse;
import com.olhari.dto.EnsaioStatusRequest;
import com.olhari.enums.StatusEnsaio;
import com.olhari.model.Cliente;
import com.olhari.model.Ensaio;
import com.olhari.repository.ClienteRepository;
import com.olhari.repository.EnsaioRepository;
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

    

    @Transactional
    public EnsaioResponse criar(EnsaioRequest request) {
        Cliente cliente = buscarCliente(request.getClienteId());

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
        return toResponse(ensaioRepository.save(ensaio));
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

    private EnsaioResponse toResponse(Ensaio ensaio) {
        return EnsaioResponse.builder()
                .id(ensaio.getId())
                .clienteId(ensaio.getCliente().getId())
                .clienteNome(ensaio.getCliente().getNome())
                .tipo(ensaio.getTipo())
                .status(ensaio.getStatus())
                .dataEnsaio(ensaio.getDataEnsaio())
                .local(ensaio.getLocal())
                .qtdFotosPacote(ensaio.getQtdFotosPacote())
                .valorPacote(ensaio.getValorPacote())
                .valorFotoExtra(ensaio.getValorFotoExtra())
                .cobrarFotoExtra(ensaio.getCobrarFotoExtra())
                .observacoes(ensaio.getObservacoes())
                .progresso(ensaio.getProgresso())
                .criadoEm(ensaio.getCriadoEm())
                .atualizadoEm(ensaio.getAtualizadoEm())
                .build();
    }
}