package com.olhari.enums;

/**
 * Linha do tempo do ensaio (RF04, RF08).
 * A fotógrafa atualiza manualmente (R03).
 */
public enum StatusEnsaio {

    AGENDADO,     // Ensaio marcado, ainda não realizado
    REALIZADO,    // Fotos tiradas, ainda não editadas
    EM_SELECAO,    // FOTOS EM SELECAO //
    EM_EDICAO,    // Fotógrafa está editando
    FINALIZACAO,  // Cliente selecionou, aguardando entrega final
    ENTREGUE,     // Fotos em alta resolução entregues
    CANCELADO;    // Ensaio cancelado

    /** Retorna true se o ensaio está em um estado final (não muda mais) */
    public boolean isFinal() {
        return this == ENTREGUE || this == CANCELADO;
    }
}