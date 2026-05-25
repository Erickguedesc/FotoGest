package com.olhari.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarcaDaguaReprocessarResponse {

    private int totalFotosReprocessadas;
    private String mensagem;
}