package com.olhari.exception;

import com.olhari.dto.ErrorResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice // Esta anotação diz ao Spring para "ouvir" exceções em todos os controllers
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleConflict(DataIntegrityViolationException ex) {
        String message = "Erro de integridade de dados.";

        // Verifica se o erro veio daquelas travas (constraints) que criamos no banco
        if (ex.getMessage() != null && ex.getMessage().contains("uk_cliente_email")) {
            message = "O e-mail informado já pertence a outro cliente.";
        } else if (ex.getMessage() != null && ex.getMessage().contains("uk_cliente_cpf")) {
            message = "O CPF informado já está vinculado a um cadastro existente.";
        }

        ErrorResponse error = new ErrorResponse(message, HttpStatus.CONFLICT.value());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }
}