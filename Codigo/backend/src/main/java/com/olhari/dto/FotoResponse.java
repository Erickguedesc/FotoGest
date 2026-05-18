package com.olhari.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FotoResponse {
    private UUID id;
    private UUID ensaioId;
    private String cloudinaryId;
    private String nomeOriginal;
    private String urlWatermark;
    private String urlOriginal;
    private Integer ordem;
    private Boolean ehCapa;
    private OffsetDateTime enviadaEm;
    
}