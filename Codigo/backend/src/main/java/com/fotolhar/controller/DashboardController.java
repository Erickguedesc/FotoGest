package com.fotolhar.controller;

import com.fotolhar.dto.DashboardResumoResponse;
import com.fotolhar.dto.RelatorioTipoEnsaioResponse;
import com.fotolhar.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/resumo")
    public DashboardResumoResponse buscarResumo() {
        return dashboardService.buscarResumo();
    }

    @GetMapping("/receita-por-tipo")
    public List<RelatorioTipoEnsaioResponse> buscarReceitaPorTipo(
            @RequestParam(required = false, defaultValue = "ESTE_MES") String periodo
    ) {
        return dashboardService.buscarReceitaPorTipoEnsaio(periodo);
    }
}
