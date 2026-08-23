package com.fotolhar.service;

import com.fotolhar.enums.MarcaDaguaPosicao;
import com.fotolhar.enums.MarcaDaguaTextoModo;
import com.fotolhar.enums.MarcaDaguaTipo;
import com.fotolhar.model.ConfiguracaoEstudio;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class MarcaDaguaServiceTest {

    private final MarcaDaguaService service = new MarcaDaguaService(null, null, null, null);

    @Test
    void gerarUrlComMarcaDaguaUsaOverlayRelativoParaTextoRepetido() {
        ConfiguracaoEstudio estudio = ConfiguracaoEstudio.builder()
                .marcaDaguaAtiva(true)
                .marcaDaguaPublicId("fotolhar/configuracoes/marca-dagua/texto")
                .marcaDaguaTipo(MarcaDaguaTipo.TEXTO)
                .marcaDaguaTextoModo(MarcaDaguaTextoModo.REPETIDA)
                .marcaDaguaOpacidade(35)
                .build();

        String url = service.gerarUrlComMarcaDagua(
                "https://res.cloudinary.com/demo/image/upload/v1/fotolhar/ensaios/foto.jpg",
                estudio
        );

        assertThat(url)
                .contains("l_fotolhar:configuracoes:marca-dagua:texto,c_fill,w_1.0,h_1.0,fl_relative,o_35")
                .doesNotContain("l_fotolhar:configuracoes:marca-dagua:texto,w_1800");
    }

    @Test
    void gerarUrlComMarcaDaguaLimitaOverlayDeImagemSemExpandirCanvas() {
        ConfiguracaoEstudio estudio = ConfiguracaoEstudio.builder()
                .marcaDaguaAtiva(true)
                .marcaDaguaPublicId("fotolhar/configuracoes/marca-dagua/logo")
                .marcaDaguaTipo(MarcaDaguaTipo.IMAGEM)
                .marcaDaguaPosicao(MarcaDaguaPosicao.INFERIOR_DIREITA)
                .marcaDaguaOpacidade(45)
                .marcaDaguaMargem(20)
                .build();

        String url = service.gerarUrlComMarcaDagua(
                "https://res.cloudinary.com/demo/image/upload/v1/fotolhar/ensaios/foto.jpg",
                estudio
        );

        assertThat(url)
                .contains("w_250,o_45,fl_no_overflow/fl_layer_apply,g_south_east,x_20,y_20");
    }
}
