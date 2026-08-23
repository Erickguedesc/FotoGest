package com.fotolhar.dto;

import com.fotolhar.enums.MarcaDaguaPosicao;
import com.fotolhar.enums.MarcaDaguaTamanho;
import lombok.*;
import com.fotolhar.enums.MarcaDaguaCor;
import com.fotolhar.enums.MarcaDaguaEstilo;
import com.fotolhar.enums.MarcaDaguaFonte;
import com.fotolhar.enums.MarcaDaguaPosicao;
import com.fotolhar.enums.MarcaDaguaTamanho;
import com.fotolhar.enums.MarcaDaguaTipo;
import com.fotolhar.enums.MarcaDaguaTextoModo;

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
