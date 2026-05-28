package com.fotogest.repository;

import com.fotogest.model.HomepageConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface HomepageConfigRepository extends JpaRepository<HomepageConfig, UUID> {
}
