package com.olhari.service;

import com.olhari.enums.StatusEnsaio;
import com.olhari.model.Album;
import com.olhari.model.ConfiguracaoEmail;
import com.olhari.model.Ensaio;
import com.olhari.repository.ConfiguracaoEmailRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private static final DateTimeFormatter DATA_BR =
            DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final JavaMailSender mailSender;
    private final ConfiguracaoEmailRepository configuracaoEmailRepository;

    @Value("${spring.mail.username:}")
    private String emailSistema;

    public void enviarAlbumPublicado(Ensaio ensaio, Album album, String senha, String urlAcesso) {
        ConfiguracaoEmail config = buscarConfiguracao(ensaio);

        if (!envioHabilitado(config) || !Boolean.TRUE.equals(config.getEnviarAlbumPublicado())) {
            return;
        }

        String destino = ensaio.getCliente().getEmail();

        if (isBlank(destino)) {
            return;
        }

        String validade = album.getExpiraEm() == null
                ? "validade não informada"
                : album.getExpiraEm().format(DATA_BR);

        String mensagem = valorOuPadrao(
                config.getMensagemAlbumPublicado(),
                "Olá! Seu álbum já está disponível. Acesse pelo link abaixo usando a senha enviada."
        );

        String corpo = String.join("\n\n",
                mensagem,
                "Cliente: " + ensaio.getCliente().getNome(),
                "Link do álbum: " + urlAcesso,
                "Senha: " + senha,
                "Disponível até: " + validade,
                "Com carinho,\n" + valorOuPadrao(config.getNomeRemetente(), "Olhari Fotografia")
        );

        enviar(config, destino, "Seu álbum está disponível", corpo);
    }

    public void avisarSelecaoRecebida(Album album, int totalSelecionadas, int excedente) {
        Ensaio ensaio = album.getEnsaio();
        ConfiguracaoEmail config = buscarConfiguracao(ensaio);

        if (!envioHabilitado(config) || !Boolean.TRUE.equals(config.getAvisarSelecaoRecebida())) {
            return;
        }

        String destino = config.getEmailFotografaAvisos();

        if (isBlank(destino)) {
            return;
        }

        String mensagem = valorOuPadrao(
                config.getMensagemSelecaoRecebida(),
                "A cliente enviou a seleção de fotos. Acesse o sistema para conferir os detalhes."
        );

        String corpo = String.join("\n\n",
                mensagem,
                "Cliente: " + ensaio.getCliente().getNome(),
                "Tipo do ensaio: " + ensaio.getTipo(),
                "Fotos selecionadas: " + totalSelecionadas,
                "Fotos extras: " + excedente
        );

        enviar(config, destino, "Seleção de fotos recebida", corpo);
    }

    public void avisarStatusAlterado(Ensaio ensaio, StatusEnsaio status) {
        ConfiguracaoEmail config = buscarConfiguracao(ensaio);

        if (!envioHabilitado(config) || !Boolean.TRUE.equals(config.getEnviarMudancaStatus())) {
            return;
        }

        String destino = ensaio.getCliente().getEmail();

        if (isBlank(destino)) {
            return;
        }

        String corpo = String.join("\n\n",
                "Olá, " + ensaio.getCliente().getNome() + ".",
                "O status do seu ensaio foi atualizado para: " + formatarStatus(status) + ".",
                "Com carinho,\n" + valorOuPadrao(config.getNomeRemetente(), "Olhari Fotografia")
        );

        enviar(config, destino, "Atualização do seu ensaio", corpo);
    }

    private ConfiguracaoEmail buscarConfiguracao(Ensaio ensaio) {
        return configuracaoEmailRepository
                .findAll()
                .stream()
                .findFirst()
                .orElse(null);
    }

    private boolean envioHabilitado(ConfiguracaoEmail config) {
        return config != null && Boolean.TRUE.equals(config.getAtivo()) && !isBlank(emailSistema);
    }

    private void enviar(ConfiguracaoEmail config, String destino, String assunto, String corpo) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");

            String nomeRemetente = valorOuPadrao(config.getNomeRemetente(), "Olhari Fotografia");

            helper.setTo(destino);
            helper.setSubject(assunto);
            helper.setText(corpo, false);
            helper.setFrom(emailSistema, nomeRemetente);

            if (!isBlank(config.getEmailResposta())) {
                helper.setReplyTo(config.getEmailResposta());
            }

            mailSender.send(message);
        } catch (Exception error) {
            log.warn("[EmailService] Não foi possível enviar e-mail para {}: {}", destino, error.getMessage());
        }
    }

    private String formatarStatus(StatusEnsaio status) {
        return switch (status) {
            case AGENDADO -> "Agendado";
            case REALIZADO -> "Realizado";
            case EM_SELECAO -> "Em seleção";
            case EM_EDICAO -> "Em edição";
            case FINALIZADO -> "Finalizado";
            case CANCELADO -> "Cancelado";
        };
    }

    private String valorOuPadrao(String value, String fallback) {
        return isBlank(value) ? fallback : value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
