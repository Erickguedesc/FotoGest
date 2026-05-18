package com.olhari.repository;

import com.olhari.model.HomepageConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface HomepageConfigRepository extends JpaRepository<HomepageConfig, UUID> {
}
