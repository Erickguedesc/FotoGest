package com.fotogest.security;

import com.fotogest.repository.FotografaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FotografaDetailsService implements UserDetailsService {

    private final FotografaRepository fotografaRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return fotografaRepository.findByEmail(email)
                .map(f -> User.builder()
                        .username(f.getEmail())
                        .password(f.getSenhaHash())
                        .roles("FOTOGRAFA")
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("Fotógrafa não encontrada: " + email));
    }
}