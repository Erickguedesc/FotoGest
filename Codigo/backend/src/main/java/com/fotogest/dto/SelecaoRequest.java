package com.fotogest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SelecaoRequest {

    private List<UUID> fotosIds;
    private Map<UUID, String> observacoesPorFoto;

}
