package com.olhari.dto;

import com.olhari.enums.MarcaDaguaPosicao;
import com.olhari.enums.MarcaDaguaTamanho;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MarcaDaguaUpdateRequest {

    private Boolean marcaDaguaAtiva;
    private MarcaDaguaPosicao marcaDaguaPosicao;
    private Integer marcaDaguaOpacidade;
    private MarcaDaguaTamanho marcaDaguaTamanho;
    private Integer marcaDaguaMargem;
}