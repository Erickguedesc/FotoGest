package com.fotogest.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @SuppressWarnings("unchecked")
    public Map<String, Object> upload(MultipartFile multipartFile, UUID ensaioId) throws IOException {
        return (Map<String, Object>) cloudinary
                .uploader()
                .upload(
                        multipartFile.getBytes(),
                        ObjectUtils.asMap(
                                "folder", "fotogest/ensaios/" + ensaioId,
                                "resource_type", "image"
                        )
                );
    }

    public void deletar(String publicId) throws IOException {
        if (publicId == null || publicId.isBlank()) {
            return;
        }

        cloudinary
                .uploader()
                .destroy(publicId, ObjectUtils.emptyMap());
    }
    @SuppressWarnings("unchecked")
public Map<String, Object> uploadConfiguracao(MultipartFile multipartFile, String pasta) throws IOException {
    return (Map<String, Object>) cloudinary
            .uploader()
            .upload(
                    multipartFile.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "fotogest/configuracoes/" + pasta,
                            "resource_type", "image"
                    )
            );
}

@SuppressWarnings("unchecked")
public Map<String, Object> uploadBytes(byte[] bytes, String pasta) throws IOException {
    return (Map<String, Object>) cloudinary
            .uploader()
            .upload(
                    bytes,
                    ObjectUtils.asMap(
                            "folder", "fotogest/configuracoes/" + pasta,
                            "resource_type", "image"
                    )
            );
}

}