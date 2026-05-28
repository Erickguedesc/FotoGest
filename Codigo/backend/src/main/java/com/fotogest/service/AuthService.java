package com.fotogest.service;

import com.fotogest.dto.AuthRequest;
import com.fotogest.dto.AuthResponse;
import com.fotogest.model.Fotografa;
import com.fotogest.repository.FotografaRepository;
import com.fotogest.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final FotografaRepository fotografaRepository;
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
        return new AuthResponse(token, fotografa.getNome(), fotografa.getEmail());
    }
}