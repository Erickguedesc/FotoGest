package com.fotolhar.service;

import com.fotolhar.model.Cliente;
import com.fotolhar.model.Usuario;
import com.fotolhar.repository.ClienteRepository;
import com.fotolhar.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ClienteOwnershipBackfill implements ApplicationRunner {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        List<Cliente> clientesSemDono = clienteRepository.findByUsuarioIsNull();

        if (clientesSemDono.isEmpty()) {
            return;
        }

        Usuario usuarioFallback = usuarioRepository.findAll()
                .stream()
                .min(Comparator.comparing(
                        Usuario::getCriadoEm,
                        Comparator.nullsLast(Comparator.naturalOrder())
                ))
                .orElse(null);

        if (usuarioFallback == null) {
            log.warn("[ClienteOwnershipBackfill] {} cliente(s) sem usuario, mas nenhum usuario existe para backfill.",
                    clientesSemDono.size());
            return;
        }

        clientesSemDono.forEach(cliente -> cliente.setUsuario(usuarioFallback));
        clienteRepository.saveAll(clientesSemDono);

        log.warn("[ClienteOwnershipBackfill] {} cliente(s) antigos vinculados a {} por falta de historico de dono.",
                clientesSemDono.size(),
                usuarioFallback.getEmail());
    }
}
