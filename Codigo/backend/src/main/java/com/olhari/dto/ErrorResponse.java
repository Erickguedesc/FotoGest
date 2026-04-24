package com.olhari.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor // <-- ESSA ANOTAÇÃO É A QUE ESTÁ FALTANDO
@NoArgsConstructor
public class ErrorResponse {
    private String mensagem;
    private int status;
}


