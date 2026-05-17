package com.olhari.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstudioUpdateRequest {
    private String nomeEstudio;
    private String nomeComercial;
    private String email;
    private String telefone;
    private String instagram;
    private String cidade;
    private String endereco;
    private String cnpj;
    private String logoUrl;
}