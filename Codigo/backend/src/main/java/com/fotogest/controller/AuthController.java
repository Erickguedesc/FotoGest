package com.fotogest.controller;

import com.fotogest.dto.AuthRequest;
import com.fotogest.dto.AuthResponse;
import com.fotogest.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody @Valid AuthRequest request) {
        return authService.login(request);
    }

 
}