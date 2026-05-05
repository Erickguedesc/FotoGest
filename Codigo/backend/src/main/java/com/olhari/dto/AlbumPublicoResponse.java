package com.olhari.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlbumPublicoResponse {

    private String nomeCliente;
    private String tipoEnsaio;
    private Integer quantidadeFotos;

}