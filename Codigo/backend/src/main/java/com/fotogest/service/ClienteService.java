package com.fotogest.service;

import com.fotogest.dto.ClienteRequest;
import com.fotogest.dto.ClienteResponse;
import com.fotogest.model.Cliente;
import com.fotogest.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteResponse criar(ClienteRequest request) {

        // Nome obrigatório → 400 Bad Request
        if (request.getNome() == null || request.getNome().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O nome do cliente é obrigatório");
        }

        // E-mail duplicado → 409 Conflict
        if (request.getEmail() != null && repository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado para outro cliente");
        }

        // CPF duplicado → 409 Conflict
        if (request.getCpf() != null && repository.existsByCpf(request.getCpf())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "CPF já cadastrado para outro cliente");
        }

        Cliente cliente = Cliente.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .telefone(request.getTelefone())
                .cpf(request.getCpf())
                .cidade(request.getCidade())
                .indicacao(request.getIndicacao())
                .ativo(true)
                .build();

        return toResponse(repository.save(cliente));
    }

    public ClienteResponse arquivar(UUID id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente nÃ£o encontrado"));

        cliente.setAtivo(false);

        return toResponse(repository.save(cliente));
    }

    public ClienteResponse reativar(UUID id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente nÃ£o encontrado"));

        cliente.setAtivo(true);

        return toResponse(repository.save(cliente));
    }

    public List<ClienteResponse> listar() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ClienteResponse buscarPorId(UUID id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado"));
        return toResponse(cliente);
    }

    public ClienteResponse atualizar(UUID id, ClienteRequest request) {

        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado"));

        // E-mail duplicado em outro cliente → 409 Conflict
        repository.findByEmail(request.getEmail()).ifPresent(existente -> {
            if (!existente.getId().equals(id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado em outro cliente");
            }
        });

        // CPF duplicado em outro cliente → 409 Conflict
        repository.findByCpf(request.getCpf()).ifPresent(existente -> {
            if (!existente.getId().equals(id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "CPF já cadastrado em outro cliente");
            }
        });

        cliente.setNome(request.getNome());
        cliente.setEmail(request.getEmail());
        cliente.setTelefone(request.getTelefone());
        cliente.setCpf(request.getCpf());
        cliente.setCidade(request.getCidade());
        cliente.setIndicacao(request.getIndicacao());

        return toResponse(repository.save(cliente));
    }

    public void deletar(UUID id) {

        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado"));

        // Cliente vinculado a ensaio não pode ser deletado → 409 Conflict
        if (!cliente.getEnsaios().isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Cliente vinculado a ensaio(s) não pode ser deletado"
            );
        }

        repository.delete(cliente);
    }

    private ClienteResponse toResponse(Cliente cliente) {
        return ClienteResponse.builder()
                .id(cliente.getId())
                .nome(cliente.getNome())
                .email(cliente.getEmail())
                .telefone(cliente.getTelefone())
                .cpf(cliente.getCpf())
                .cidade(cliente.getCidade())
                .indicacao(cliente.getIndicacao())
                .ativo(cliente.getAtivo())
                .build();
    }
}
