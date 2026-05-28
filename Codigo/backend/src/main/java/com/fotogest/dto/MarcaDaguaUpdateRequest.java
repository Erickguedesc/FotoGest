package com.fotogest.dto;

import com.fotogest.enums.MarcaDaguaPosicao;
import com.fotogest.enums.MarcaDaguaTamanho;
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