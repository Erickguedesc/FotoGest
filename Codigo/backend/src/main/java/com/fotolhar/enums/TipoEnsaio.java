package com.fotolhar.enums;

/** Tipos de ensaio disponíveis no sistema */
public enum TipoEnsaio {
    NEWBORN("Newborn"),
    GESTANTE("Gestante"),
    FAMILIA("Família"),
    INFANTIL("Infantil"),
    FEMININO("Feminino"),
    CASAL("Casal"),
    BOOK("Book"),
    BATIZADO("Batizado"),
    EXTERNO("Externo"),
    FORMATURA("Formatura"),
    EVENTO("Evento"),
    DEBUTANTE("Debutante"),
    OUTRO("Outro");

    private final String descricao;

    private TipoEnsaio(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}