package com.fotolhar.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnsaioDetalhesResponse {

    private EnsaioResponse ensaio;
    private List<FotoResponse> fotos;
    private AlbumAdminResponseDTO album;
    private List<HistoricoStatusEnsaioResponse> historicoStatus;
    private SelecaoResponse selecao;
}
