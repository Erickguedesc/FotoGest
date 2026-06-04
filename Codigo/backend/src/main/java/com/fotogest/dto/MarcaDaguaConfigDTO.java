package com.fotogest.dto;

import com.fotogest.enums.MarcaDaguaPosicao;
import com.fotogest.enums.MarcaDaguaTamanho;
import lombok.*;
import com.fotogest.enums.MarcaDaguaCor;
import com.fotogest.enums.MarcaDaguaEstilo;
import com.fotogest.enums.MarcaDaguaFonte;
import com.fotogest.enums.MarcaDaguaPosicao;
import com.fotogest.enums.MarcaDaguaTamanho;
import com.fotogest.enums.MarcaDaguaTipo;
import com.fotogest.enums.MarcaDaguaTextoModo;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarcaDaguaConfigDTO {

    private String marcaDaguaUrl;
    private String marcaDaguaPublicId;

    private Boolean marcaDaguaAtiva;
    private MarcaDaguaPosicao marcaDaguaPosicao;
    private Integer marcaDaguaOpacidade;
    private MarcaDaguaTamanho marcaDaguaTamanho;
    private Integer marcaDaguaMargem;

    private MarcaDaguaTipo marcaDaguaTipo;
    private String marcaDaguaTexto;
    private MarcaDaguaFonte marcaDaguaFonte;
    private MarcaDaguaCor marcaDaguaCor;
    private MarcaDaguaEstilo marcaDaguaEstilo;
    private MarcaDaguaTextoModo marcaDaguaTextoModo;
}
