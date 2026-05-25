package com.olhari.dto;

import com.olhari.enums.MarcaDaguaPosicao;
import com.olhari.enums.MarcaDaguaTamanho;
import lombok.*;
import com.olhari.enums.MarcaDaguaCor;
import com.olhari.enums.MarcaDaguaEstilo;
import com.olhari.enums.MarcaDaguaFonte;
import com.olhari.enums.MarcaDaguaPosicao;
import com.olhari.enums.MarcaDaguaTamanho;
import com.olhari.enums.MarcaDaguaTipo;

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
}