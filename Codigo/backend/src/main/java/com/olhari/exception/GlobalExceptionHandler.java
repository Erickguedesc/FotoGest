package com.olhari.exception;

import com.olhari.dto.ErrorResponse;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ── Cliente — email/CPF duplicado ────────────────────────────────────────
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleConflict(DataIntegrityViolationException ex) {
        String message = "Erro de integridade de dados.";

        if (ex.getMessage() != null && ex.getMessage().contains("uk_cliente_email")) {
            message = "O e-mail informado já pertence a outro cliente.";
        } else if (ex.getMessage() != null && ex.getMessage().contains("uk_cliente_cpf")) {
            message = "O CPF informado já está vinculado a um cadastro existente.";
        }

        return new ResponseEntity<>(
            new ErrorResponse(message, HttpStatus.CONFLICT.value()),
            HttpStatus.CONFLICT
        );
    }

    // ── 404 — Entidade não encontrada (Cliente, Ensaio, etc.) ────────────────
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("erro", ex.getMessage()));
    }

    // ── 400 — Regra de negócio violada (ex: DELETE com status inválido) ──────
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalState(IllegalStateException ex) {
        return ResponseEntity.badRequest()
                .body(Map.of("erro", ex.getMessage()));
    }

    // ── 400 — Validações do @Valid (@NotNull, @Size, @DecimalMin...) ──────────
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> erros = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(err -> erros.put(err.getField(), err.getDefaultMessage()));
        return ResponseEntity.badRequest().body(erros);
    }
    // Adiciona dentro do GlobalExceptionHandler:
@ExceptionHandler(ResponseStatusException.class)
public ResponseEntity<Map<String, String>> handleResponseStatus(ResponseStatusException ex) {
    return ResponseEntity
            .status(ex.getStatusCode())
            .body(Map.of("message", ex.getReason()));
}
}