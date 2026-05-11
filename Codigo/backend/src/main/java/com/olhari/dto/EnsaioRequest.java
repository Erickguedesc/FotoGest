package com.olhari.dto;

import com.olhari.enums.TipoEnsaio;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnsaioRequest {

    @NotNull(message = "Cliente é obrigatório")
    private UUID clienteId;

    // Dados opcionais da cliente para edição junto com o ensaio
    @Size(max = 200, message = "Nome da cliente deve ter no máximo 200 caracteres")
    private String clienteNome;

    @Size(max = 200, message = "E-mail da cliente deve ter no máximo 200 caracteres")
    private String clienteEmail;

    @Size(max = 30, message = "Telefone da cliente deve ter no máximo 30 caracteres")
    private String clienteTelefone;

    @Size(max = 20, message = "CPF da cliente deve ter no máximo 20 caracteres")
    private String clienteCpf;

    @Size(max = 120, message = "Cidade deve ter no máximo 120 caracteres")
    private String clienteCidade;

    @Size(max = 120, message = "Indicação deve ter no máximo 120 caracteres")
    private String clienteIndicacao;

    @NotNull(message = "Tipo do ensaio é obrigatório")
    private TipoEnsaio tipo;

    @NotNull(message = "Data do ensaio é obrigatória")
    private OffsetDateTime dataEnsaio;

    @NotBlank(message = "Local é obrigatório")
    private String local;

    @NotNull(message = "Quantidade de fotos do pacote é obrigatória")
    @Min(value = 1, message = "Deve ter pelo menos 1 foto no pacote")
    private Integer qtdFotosPacote;

    @DecimalMin(value = "0.01", inclusive = true, message = "Valor do pacote deve ser maior que zero")
    private BigDecimal valorPacote;

    private BigDecimal valorFotoExtra;

    @NotNull(message = "Informe se cobra foto extra")
    private Boolean cobrarFotoExtra;

    @Size(max = 400, message = "Observações deve ter no máximo 400 caracteres")
    private String observacoes;
}