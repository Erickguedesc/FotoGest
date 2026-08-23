package com.fotolhar.controller;

import com.fotolhar.dto.DashboardResumoResponse;
import com.fotolhar.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/resumo")
    public DashboardResumoResponse buscarResumo() {
        return dashboardService.buscarResumo();
    }
}