package com.olhari.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                // Preflight OPTIONS sempre liberado
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Rotas públicas
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/solicitacoes/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/homepage/cursos").permitAll()
                .requestMatchers("/actuator/**").permitAll()

                // Álbum público da cliente
                .requestMatchers(HttpMethod.GET, "/album/*").permitAll()
                .requestMatchers(HttpMethod.POST, "/album/*/acessar").permitAll()
                .requestMatchers(HttpMethod.POST, "/album/*/selecao").permitAll()
                .requestMatchers(HttpMethod.GET, "/album/*/selecao").permitAll()

                // Álbum administrativo da fotógrafa
                .requestMatchers(HttpMethod.POST, "/album/gerar/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/album/ensaio/**").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/album/reabrir/**").authenticated()

                // Fotos administrativas
                .requestMatchers("/fotos/**").authenticated()

                // Todo o resto exige autenticação
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}