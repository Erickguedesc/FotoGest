package com.olhari.controller;

import com.olhari.dto.AuthRequest;
import com.olhari.dto.AuthResponse;
import com.olhari.service.AuthService;
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