package com.olhari.dto;

import com.olhari.enums.MarcaDaguaPosicao;
import com.olhari.enums.MarcaDaguaTamanho;
import lombok.*;

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
}