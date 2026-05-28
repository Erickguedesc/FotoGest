package com.fotogest.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConfiguracoesResponseDTO {
    private FotografaConfigDTO fotografa;
    private EstudioConfigDTO estudio;
    private PreferenciasConfigDTO preferencias;
    private MarcaDaguaConfigDTO marcaDagua;
    private EmailConfigDTO email;
}
