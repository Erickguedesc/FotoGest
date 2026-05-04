package com.olhari.dto;

public record AcessoAlbumResponse(
        boolean autorizado,
        String token
) {}