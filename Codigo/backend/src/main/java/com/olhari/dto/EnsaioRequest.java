package com.olhari.dto;

import com.olhari.enums.TipoEnsaio;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EnsaioRequest {

    @NotNull(message = "Cliente é obrigatório")
    private UUID clienteId;

    @NotNull(message = "Tipo do ensaio é obrigatório")
    private TipoEnsaio tipo;

    @NotNull(message = "Data do ensaio é obrigatória")
    private OffsetDateTime dataEnsaio;

    @NotBlank(message = "Local é obrigatório")
    private String local;


// ✅ Sem default — campo obrigatório, fotógrafa que decide
@NotNull(message = "Quantidade de fotos do pacote é obrigatória")
@Min(value = 1, message = "Deve ter pelo menos 1 foto no pacote")
private Integer qtdFotosPacote;


// ✅ Força valor real acima de zero
@DecimalMin(value = "0.01", inclusive = true, message = "Valor do pacote deve ser maior que zero")
private BigDecimal valorPacote;
private BigDecimal valorFotoExtra;


// ✅ Sem default — fotógrafa marca explicitamente sim ou não
@NotNull(message = "Informe se cobra foto extra")
private Boolean cobrarFotoExtra;


@Size(max = 400, message = "Observações deve ter no máximo 400 caracteres")
private String observacoes;

}