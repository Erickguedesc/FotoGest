package com.olhari.service;

import com.olhari.dto.ClienteRequest;
import com.olhari.dto.ClienteResponse;
import com.olhari.model.Cliente;
import com.olhari.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteResponse criar(ClienteRequest request) {

        if (request.getEmail() != null && repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }

        if (request.getCpf() != null && repository.existsByCpf(request.getCpf())) {
            throw new RuntimeException("CPF já cadastrado");
        }

        Cliente cliente = Cliente.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .telefone(request.getTelefone())
                .cpf(request.getCpf())
                .cidade(request.getCidade())
                .indicacao(request.getIndicacao())
                .build();

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
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        return toResponse(cliente);
    }

    public ClienteResponse atualizar(UUID id, ClienteRequest request) {

        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

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
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        // 🔥 REGRA IMPORTANTE DO PROJETO
        if (!cliente.getEnsaios().isEmpty()) {
            throw new RuntimeException("Cliente vinculado a ensaio não pode ser deletado");
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
                .build();
    }
}