package com.olhari.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SelecaoResponse {

    private List<UUID> fotosIds;
    private Integer totalSelecionadas;
    private Integer limitePlano;
    private Integer excedente;
    private Double valorExcedente;

}