package com.fotolhar.controller;

import com.fotolhar.dto.AuthRequest;
import com.fotolhar.dto.AuthResponse;
import com.fotolhar.service.AuthService;
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