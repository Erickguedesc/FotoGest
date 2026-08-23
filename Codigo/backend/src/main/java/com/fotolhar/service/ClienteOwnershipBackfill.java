package com.fotolhar.service;

import com.fotolhar.model.Cliente;
import com.fotolhar.model.Fotografa;
import com.fotolhar.repository.ClienteRepository;
import com.fotolhar.repository.FotografaRepository;
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
    private final FotografaRepository fotografaRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        List<Cliente> clientesSemDono = clienteRepository.findByFotografaIsNull();

        if (clientesSemDono.isEmpty()) {
            return;
        }

        Fotografa fotografaFallback = fotografaRepository.findAll()
                .stream()
                .min(Comparator.comparing(
                        Fotografa::getCriadoEm,
                        Comparator.nullsLast(Comparator.naturalOrder())
                ))
                .orElse(null);

        if (fotografaFallback == null) {
            log.warn("[ClienteOwnershipBackfill] {} cliente(s) sem fotografa, mas nenhuma fotografa existe para backfill.",
                    clientesSemDono.size());
            return;
        }

        clientesSemDono.forEach(cliente -> cliente.setFotografa(fotografaFallback));
        clienteRepository.saveAll(clientesSemDono);

        log.warn("[ClienteOwnershipBackfill] {} cliente(s) antigos vinculados a {} por falta de historico de dono.",
                clientesSemDono.size(),
                fotografaFallback.getEmail());
    }
}
