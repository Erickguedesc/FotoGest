package com.olhari.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

 @SuppressWarnings("unchecked")
public Map<String, Object> upload(MultipartFile multipartFile) throws IOException {
    return (Map<String, Object>) cloudinary
        .uploader()
        .upload(multipartFile.getBytes(), ObjectUtils.emptyMap());
}
}

// antes estava assim //

  //  @Autowired
   // private Cloudinary cloudinary;

   // public Map upload(MultipartFile multipartFile) throws IOException {
  // O Cloudinary recebe o arquivo e retorna um Map com URL, ID, tamanho, etc.
    //    return cloudinary.uploader().upload(multipartFile.getBytes(), ObjectUtils.emptyMap());
//}
//}