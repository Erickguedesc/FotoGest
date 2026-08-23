package com.fotolhar.dto;

import com.fotolhar.enums.MarcaDaguaPosicao;
import com.fotolhar.enums.MarcaDaguaTamanho;
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