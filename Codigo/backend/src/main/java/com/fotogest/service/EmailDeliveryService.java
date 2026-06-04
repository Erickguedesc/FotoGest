package com.fotogest.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailDeliveryService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String emailSistema;

    @Async("emailTaskExecutor")
    public void enviarAutomatico(
            String destino,
            String assunto,
            String corpo,
            String nomeRemetente,
            String replyTo
    ) {
        try {
            enviar(destino, assunto, corpo, nomeRemetente, replyTo);
        } catch (Exception error) {
            log.warn("[EmailDeliveryService] Nao foi possivel enviar e-mail para {}: {}", destino, error.getMessage());
        }
    }

    @Async("emailTaskExecutor")
    public void enviarAutomaticoComAnexo(
            String destino,
            String assunto,
            String corpo,
            String nomeRemetente,
            String replyTo,
            String nomeAnexo,
            byte[] anexo
    ) {
        try {
            enviar(destino, assunto, corpo, nomeRemetente, replyTo, nomeAnexo, anexo);
        } catch (Exception error) {
            log.warn("[EmailDeliveryService] Nao foi possivel enviar e-mail com anexo para {}: {}", destino, error.getMessage());
        }
    }

    public void enviarObrigatorio(
            String destino,
            String assunto,
            String corpo,
            String nomeRemetente,
            String replyTo
    ) {
        try {
            enviar(destino, assunto, corpo, nomeRemetente, replyTo);
        } catch (Exception error) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Nao foi possivel enviar o e-mail: " + error.getMessage()
            );
        }
    }

    private void enviar(
            String destino,
            String assunto,
            String corpo,
            String nomeRemetente,
            String replyTo
    ) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");

        helper.setTo(destino);
        helper.setSubject(assunto);
        helper.setText(corpo, false);
        helper.setFrom(emailSistema, nomeRemetente);

        if (!isBlank(replyTo)) {
            helper.setReplyTo(replyTo);
        }

        mailSender.send(message);
    }

    private void enviar(
            String destino,
            String assunto,
            String corpo,
            String nomeRemetente,
            String replyTo,
            String nomeAnexo,
            byte[] anexo
    ) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(destino);
        helper.setSubject(assunto);
        helper.setText(corpo, false);
        helper.setFrom(emailSistema, nomeRemetente);

        if (!isBlank(replyTo)) {
            helper.setReplyTo(replyTo);
        }

        if (anexo != null && anexo.length > 0 && !isBlank(nomeAnexo)) {
            helper.addAttachment(nomeAnexo, new ByteArrayResource(anexo));
        }

        mailSender.send(message);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
