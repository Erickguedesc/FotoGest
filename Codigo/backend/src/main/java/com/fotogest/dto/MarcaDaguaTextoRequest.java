package com.fotogest.dto;

import com.fotogest.enums.MarcaDaguaCor;
import com.fotogest.enums.MarcaDaguaEstilo;
import com.fotogest.enums.MarcaDaguaFonte;
import com.fotogest.enums.MarcaDaguaTextoModo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MarcaDaguaTextoRequest {

    @NotBlank(message = "Informe o texto da marca d'água")
    @Size(max = 200, message = "O texto deve ter no máximo 200 caracteres")
    private String texto;

    private MarcaDaguaFonte fonte = MarcaDaguaFonte.MODERNA;

    private MarcaDaguaCor cor = MarcaDaguaCor.BRANCO;

    private MarcaDaguaEstilo estilo = MarcaDaguaEstilo.NORMAL;

    private MarcaDaguaTextoModo modo = MarcaDaguaTextoModo.REPETIDA;
}
