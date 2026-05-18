package com.olhari.service;

import com.olhari.dto.*;
import com.olhari.model.ConfiguracaoEstudio;
import com.olhari.model.Fotografa;
import com.olhari.model.PreferenciasSistema;
import com.olhari.repository.ConfiguracaoEstudioRepository;
import com.olhari.repository.FotografaRepository;
import com.olhari.repository.PreferenciasSistemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
@Service
@RequiredArgsConstructor

public class ConfiguracoesService {

    private final FotografaRepository fotografaRepository;
    private final ConfiguracaoEstudioRepository configuracaoEstudioRepository;
    private final PreferenciasSistemaRepository preferenciasSistemaRepository;
    private final PasswordEncoder passwordEncoder;
    private final CloudinaryService cloudinaryService;

    @Transactional
    public ConfiguracoesResponseDTO buscarConfiguracoes() {
        Fotografa fotografa = getFotografaLogada();
        ConfiguracaoEstudio estudio = getOuCriarEstudio(fotografa);
        PreferenciasSistema preferencias = getOuCriarPreferencias(fotografa);

        return ConfiguracoesResponseDTO.builder()
                .fotografa(toFotografaDTO(fotografa))
                .estudio(toEstudioDTO(estudio))
                .preferencias(toPreferenciasDTO(preferencias))
                .build();
    }

    @Transactional
    public FotografaConfigDTO atualizarFotografa(FotografaUpdateRequest request) {
        Fotografa fotografa = getFotografaLogada();

        if (!fotografa.getEmail().equalsIgnoreCase(request.getEmail())) {
            boolean emailJaExiste = fotografaRepository.findByEmail(request.getEmail())
                    .filter(f -> !f.getId().equals(fotografa.getId()))
                    .isPresent();

            if (emailJaExiste) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Já existe uma conta com este e-mail"
                );
            }
        }

        fotografa.setNome(request.getNome());
        fotografa.setEmail(request.getEmail());
        fotografa.setTelefone(request.getTelefone());
        fotografa.setCidade(request.getCidade());
        fotografa.setFotoPerfilUrl(request.getFotoPerfilUrl());

        fotografaRepository.save(fotografa);

        return toFotografaDTO(fotografa);
    }

    @Transactional
    public EstudioConfigDTO atualizarEstudio(EstudioUpdateRequest request) {
        Fotografa fotografa = getFotografaLogada();
        ConfiguracaoEstudio estudio = getOuCriarEstudio(fotografa);

        estudio.setNomeEstudio(request.getNomeEstudio());
        estudio.setNomeComercial(request.getNomeComercial());
        estudio.setEmail(request.getEmail());
        estudio.setTelefone(request.getTelefone());
        estudio.setInstagram(request.getInstagram());
        estudio.setCidade(request.getCidade());
        estudio.setEndereco(request.getEndereco());
        estudio.setCnpj(request.getCnpj());
        estudio.setLogoUrl(request.getLogoUrl());

        configuracaoEstudioRepository.save(estudio);

        return toEstudioDTO(estudio);
    }

    @Transactional
    public PreferenciasConfigDTO atualizarPreferencias(PreferenciasUpdateRequest request) {
        Fotografa fotografa = getFotografaLogada();
        PreferenciasSistema preferencias = getOuCriarPreferencias(fotografa);

        preferencias.setQtdFotosPadrao(request.getQtdFotosPadrao());
        preferencias.setValorFotoExtraPadrao(request.getValorFotoExtraPadrao());
        preferencias.setPrazoExpiracaoAlbumDias(request.getPrazoExpiracaoAlbumDias());
        preferencias.setCidadePadrao(request.getCidadePadrao());
        preferencias.setMensagemEnvioAlbum(request.getMensagemEnvioAlbum());
        preferencias.setMensagemSelecaoRecebida(request.getMensagemSelecaoRecebida());

        preferenciasSistemaRepository.save(preferencias);

        return toPreferenciasDTO(preferencias);
    }

    @Transactional
    public void alterarSenha(AlterarSenhaRequest request) {
        Fotografa fotografa = getFotografaLogada();

        if (!passwordEncoder.matches(request.getSenhaAtual(), fotografa.getSenhaHash())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Senha atual incorreta"
            );
        }

        if (!request.getNovaSenha().equals(request.getConfirmarNovaSenha())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A confirmação da nova senha não confere"
            );
        }

        if (request.getNovaSenha().length() < 6) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A nova senha deve ter pelo menos 6 caracteres"
            );
        }

        fotografa.setSenhaHash(passwordEncoder.encode(request.getNovaSenha()));
        fotografaRepository.save(fotografa);
    }

    private Fotografa getFotografaLogada() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return fotografaRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Fotógrafa autenticada não encontrada"
                ));
    }

    private ConfiguracaoEstudio getOuCriarEstudio(Fotografa fotografa) {
        return configuracaoEstudioRepository.findByFotografaId(fotografa.getId())
                .orElseGet(() -> configuracaoEstudioRepository.save(
                        ConfiguracaoEstudio.builder()
                                .fotografa(fotografa)
                                .nomeEstudio("Olhari Fotografia")
                                .nomeComercial("Olhari")
                                .email(fotografa.getEmail())
                                .telefone(fotografa.getTelefone())
                                .cnpj(fotografa.getCnpj())
                                .logoUrl(fotografa.getLogoUrl())
                                .build()
                ));
    }

    private PreferenciasSistema getOuCriarPreferencias(Fotografa fotografa) {
        return preferenciasSistemaRepository.findByFotografaId(fotografa.getId())
                .orElseGet(() -> preferenciasSistemaRepository.save(
                        PreferenciasSistema.builder()
                                .fotografa(fotografa)
                                .qtdFotosPadrao(20)
                                .prazoExpiracaoAlbumDias(30)
                                .mensagemEnvioAlbum("Olá! Seu álbum já está disponível. Acesse pelo link usando a senha enviada.")
                                .mensagemSelecaoRecebida("Recebemos sua seleção de fotos. Em breve entraremos em contato com os próximos passos.")
                                .build()
                ));
    }

    private FotografaConfigDTO toFotografaDTO(Fotografa fotografa) {
        return FotografaConfigDTO.builder()
                .id(fotografa.getId())
                .nome(fotografa.getNome())
                .email(fotografa.getEmail())
                .telefone(fotografa.getTelefone())
                .cidade(fotografa.getCidade())
                .fotoPerfilUrl(fotografa.getFotoPerfilUrl())
                .build();
    }

    private EstudioConfigDTO toEstudioDTO(ConfiguracaoEstudio estudio) {
        return EstudioConfigDTO.builder()
                .id(estudio.getId())
                .nomeEstudio(estudio.getNomeEstudio())
                .nomeComercial(estudio.getNomeComercial())
                .email(estudio.getEmail())
                .telefone(estudio.getTelefone())
                .instagram(estudio.getInstagram())
                .cidade(estudio.getCidade())
                .endereco(estudio.getEndereco())
                .cnpj(estudio.getCnpj())
                .logoUrl(estudio.getLogoUrl())
                .build();
    }

    private PreferenciasConfigDTO toPreferenciasDTO(PreferenciasSistema preferencias) {
        return PreferenciasConfigDTO.builder()
                .id(preferencias.getId())
                .qtdFotosPadrao(preferencias.getQtdFotosPadrao())
                .valorFotoExtraPadrao(preferencias.getValorFotoExtraPadrao())
                .prazoExpiracaoAlbumDias(preferencias.getPrazoExpiracaoAlbumDias())
                .cidadePadrao(preferencias.getCidadePadrao())
                .mensagemEnvioAlbum(preferencias.getMensagemEnvioAlbum())
                .mensagemSelecaoRecebida(preferencias.getMensagemSelecaoRecebida())
                .build();
    }
    @Transactional
public FotografaConfigDTO uploadFotoPerfil(MultipartFile arquivo) {
    validarImagem(arquivo);

    Fotografa fotografa = getFotografaLogada();

    try {
        Map<String, Object> uploadResult =
                cloudinaryService.uploadConfiguracao(arquivo, "perfil");

        String url = String.valueOf(uploadResult.get("secure_url"));

        fotografa.setFotoPerfilUrl(url);
        fotografaRepository.save(fotografa);

        return toFotografaDTO(fotografa);
    } catch (IOException e) {
        throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Não foi possível enviar a foto de perfil"
        );
    }
}

@Transactional
public EstudioConfigDTO uploadLogoEstudio(MultipartFile arquivo) {
    validarImagem(arquivo);

    Fotografa fotografa = getFotografaLogada();
    ConfiguracaoEstudio estudio = getOuCriarEstudio(fotografa);

    try {
        Map<String, Object> uploadResult =
                cloudinaryService.uploadConfiguracao(arquivo, "estudio");

        String url = String.valueOf(uploadResult.get("secure_url"));

        estudio.setLogoUrl(url);
        configuracaoEstudioRepository.save(estudio);

        return toEstudioDTO(estudio);
    } catch (IOException e) {
        throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Não foi possível enviar a logo do estúdio"
        );
    }
}
private void validarImagem(MultipartFile arquivo) {
    if (arquivo == null || arquivo.isEmpty()) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Arquivo de imagem inválido"
        );
    }

    String contentType = arquivo.getContentType();

    boolean tipoValido =
            "image/jpeg".equals(contentType) ||
            "image/png".equals(contentType) ||
            "image/webp".equals(contentType);

    if (!tipoValido) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Formato inválido. Envie apenas JPG, PNG ou WEBP"
        );
    }
}
    
}