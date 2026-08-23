package com.fotolhar.service;

import com.fotolhar.dto.AuthRequest;
import com.fotolhar.dto.AuthResponse;
import com.fotolhar.model.ConfiguracaoEstudio;
import com.fotolhar.model.Fotografa;
import com.fotolhar.repository.ConfiguracaoEstudioRepository;
import com.fotolhar.repository.FotografaRepository;
import com.fotolhar.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final FotografaRepository fotografaRepository;
    private final ConfiguracaoEstudioRepository configuracaoEstudioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse login(AuthRequest request) {
        Fotografa fotografa = fotografaRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Email ou senha inválidos"));

        if (!passwordEncoder.matches(request.getSenha(), fotografa.getSenhaHash())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Email ou senha inválidos");
        }

        if (!fotografa.getAtivo()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Conta desativada");
        }

        String token = jwtUtil.gerarToken(fotografa.getEmail());
        ConfiguracaoEstudio estudio = configuracaoEstudioRepository
                .findByFotografaId(fotografa.getId())
                .orElse(null);

        String nomeEstudio = estudio != null ? estudio.getNomeEstudio() : null;
        String nomeComercial = estudio != null ? estudio.getNomeComercial() : null;
        String nomeExibicao = primeiroPreenchido(nomeComercial, nomeEstudio, fotografa.getNome());

        return new AuthResponse(
                token,
                fotografa.getNome(),
                fotografa.getEmail(),
                nomeExibicao,
                nomeEstudio,
                nomeComercial,
                Boolean.TRUE.equals(fotografa.getOnboardingConcluido())
        );
    }

    private String primeiroPreenchido(String... valores) {
        for (String valor : valores) {
            if (valor != null && !valor.isBlank() && !isNomeGenerico(valor)) {
                return valor.trim();
            }
        }

        return "";
    }

    private boolean isNomeGenerico(String valor) {
        String normalizado = valor.trim().toLowerCase();
        return normalizado.equals("seu estudio")
                || normalizado.equals("seu estúdio")
                || normalizado.equals("seu estudio fotografico")
                || normalizado.equals("seu estúdio fotográfico");
    }
}
