package com.fotolhar.service;

import com.fotolhar.dto.RelatorioTipoEnsaioResponse;
import com.fotolhar.enums.StatusEnsaio;
import com.fotolhar.enums.TipoEnsaio;
import com.fotolhar.model.Ensaio;
import com.fotolhar.model.Usuario;
import com.fotolhar.repository.AlbumRepository;
import com.fotolhar.repository.ClienteRepository;
import com.fotolhar.repository.EnsaioRepository;
import com.fotolhar.repository.FotoRepository;
import com.fotolhar.repository.HistoricoStatusEnsaioRepository;
import com.fotolhar.repository.PreferenciasSistemaRepository;
import com.fotolhar.repository.SelecaoFotoRepository;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class DashboardServiceTest {

    private static final ZoneId APP_ZONE = ZoneId.of("America/Sao_Paulo");

    private final EnsaioRepository ensaioRepository = mock(EnsaioRepository.class);
    private final ClienteRepository clienteRepository = mock(ClienteRepository.class);
    private final FotoRepository fotoRepository = mock(FotoRepository.class);
    private final AlbumRepository albumRepository = mock(AlbumRepository.class);
    private final HistoricoStatusEnsaioRepository historicoStatusEnsaioRepository =
            mock(HistoricoStatusEnsaioRepository.class);
    private final SelecaoFotoRepository selecaoFotoRepository = mock(SelecaoFotoRepository.class);
    private final PreferenciasSistemaRepository preferenciasSistemaRepository =
            mock(PreferenciasSistemaRepository.class);
    private final UsuarioContextService usuarioContextService = mock(UsuarioContextService.class);

    private final DashboardService service = new DashboardService(
            ensaioRepository,
            clienteRepository,
            fotoRepository,
            albumRepository,
            historicoStatusEnsaioRepository,
            selecaoFotoRepository,
            preferenciasSistemaRepository,
            usuarioContextService
    );

    @Test
    void receitaPorTipoConsideraSomenteValoresPagosNoPeriodoSemExigirFinalizado() {
        UUID usuarioId = UUID.randomUUID();
        Usuario usuario = Usuario.builder()
                .id(usuarioId)
                .build();
        OffsetDateTime dataEsteMes = YearMonth.now(APP_ZONE)
                .atDay(10)
                .atTime(10, 0)
                .atZone(APP_ZONE)
                .toOffsetDateTime();
        OffsetDateTime dataMesPassado = dataEsteMes.minusMonths(1);

        when(usuarioContextService.getUsuarioLogado()).thenReturn(usuario);
        when(ensaioRepository.findByClienteUsuarioId(usuarioId)).thenReturn(List.of(
                ensaio(TipoEnsaio.GESTANTE, StatusEnsaio.EM_EDICAO, " PAGO ", dataEsteMes, "700.00"),
                ensaio(TipoEnsaio.FAMILIA, StatusEnsaio.FINALIZADO, "PENDENTE", dataEsteMes, "1000.00"),
                ensaio(TipoEnsaio.NEWBORN, StatusEnsaio.FINALIZADO, "PAGO", dataEsteMes, "900.00"),
                ensaio(TipoEnsaio.BOOK, StatusEnsaio.EM_EDICAO, "PAGO", dataMesPassado, "500.00")
        ));
        when(albumRepository.findByEnsaioClienteUsuarioId(usuarioId)).thenReturn(List.of());

        List<RelatorioTipoEnsaioResponse> resultado = service.buscarReceitaPorTipoEnsaio("ESTE_MES");

        assertThat(resultado)
                .extracting(RelatorioTipoEnsaioResponse::getTipo)
                .containsExactly(TipoEnsaio.NEWBORN, TipoEnsaio.GESTANTE);
        assertThat(resultado.get(0).getFaturamento()).isEqualByComparingTo("900.00");
        assertThat(resultado.get(0).getPercentualReceita()).isEqualByComparingTo("56.3");
        assertThat(resultado.get(1).getFaturamento()).isEqualByComparingTo("700.00");
        assertThat(resultado.get(1).getPercentualReceita()).isEqualByComparingTo("43.8");
    }

    private Ensaio ensaio(
            TipoEnsaio tipo,
            StatusEnsaio status,
            String statusValores,
            OffsetDateTime dataEnsaio,
            String valorPacote
    ) {
        return Ensaio.builder()
                .id(UUID.randomUUID())
                .tipo(tipo)
                .status(status)
                .statusValores(statusValores)
                .dataEnsaio(dataEnsaio)
                .valorPacote(new BigDecimal(valorPacote))
                .qtdFotosPacote(20)
                .cobrarFotoExtra(false)
                .build();
    }
}
