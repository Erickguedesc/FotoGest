package com.olhari.specification;

import com.olhari.enums.StatusEnsaio;
import com.olhari.enums.TipoEnsaio;
import com.olhari.model.Ensaio;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

public class EnsaioSpecification {

    public static Specification<Ensaio> filtrar(
            StatusEnsaio status,
            TipoEnsaio tipo,
            OffsetDateTime dataInicio,
            OffsetDateTime dataFim,
            String clienteNome
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (tipo != null) {
                predicates.add(cb.equal(root.get("tipo"), tipo));
            }

            if (dataInicio != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("dataEnsaio"), dataInicio));
            }

            if (dataFim != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("dataEnsaio"), dataFim));
            }

            if (clienteNome != null && !clienteNome.isBlank()) {
                predicates.add(cb.like(
                    cb.lower(root.get("cliente").get("nome")),
                    "%" + clienteNome.toLowerCase() + "%"
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}