package com.olhari.service;

import com.olhari.dto.HomepageCursoRequest;
import com.olhari.dto.HomepageCursoResponse;
import com.olhari.model.HomepageCurso;
import com.olhari.repository.HomepageCursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HomepageCursoService {

    private final HomepageCursoRepository repository;

    @Transactional(readOnly = true)
    public List<HomepageCursoResponse> listarAtivos() {
        return repository.findByAtivoTrueOrderByOrdemAscTituloAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<HomepageCursoResponse> listarTodos() {
        return repository.findAllByOrderByOrdemAscTituloAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public HomepageCursoResponse criar(HomepageCursoRequest request) {
        HomepageCurso curso = HomepageCurso.builder().build();
        preencher(curso, request);
        return toResponse(repository.save(curso));
    }

    @Transactional
    public HomepageCursoResponse atualizar(UUID id, HomepageCursoRequest request) {
        HomepageCurso curso = buscarEntidade(id);
        preencher(curso, request);
        return toResponse(repository.save(curso));
    }

    @Transactional
    public HomepageCursoResponse ocultar(UUID id) {
        HomepageCurso curso = buscarEntidade(id);
        curso.setAtivo(false);
        return toResponse(repository.save(curso));
    }

    @Transactional
    public HomepageCursoResponse ativar(UUID id) {
        HomepageCurso curso = buscarEntidade(id);
        curso.setAtivo(true);
        return toResponse(repository.save(curso));
    }

    @Transactional
    public void deletar(UUID id) {
        HomepageCurso curso = buscarEntidade(id);
        repository.delete(curso);
    }

    private HomepageCurso buscarEntidade(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Curso/produto não encontrado"
                ));
    }

    private void preencher(HomepageCurso curso, HomepageCursoRequest request) {
        curso.setTitulo(request.getTitulo().trim());
        curso.setDescricao(request.getDescricao().trim());
        curso.setImagemUrl(request.getImagemUrl().trim());
        curso.setPrecoTexto(normalizarOpcional(request.getPrecoTexto()));
        curso.setLinkExterno(request.getLinkExterno().trim());
        curso.setTextoBotao(
                request.getTextoBotao() == null || request.getTextoBotao().isBlank()
                        ? "Conhecer produto"
                        : request.getTextoBotao().trim()
        );
        curso.setAtivo(request.getAtivo() == null ? true : request.getAtivo());
        curso.setOrdem(request.getOrdem() == null ? 0 : request.getOrdem());
    }

    private String normalizarOpcional(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private HomepageCursoResponse toResponse(HomepageCurso curso) {
        return HomepageCursoResponse.builder()
                .id(curso.getId())
                .titulo(curso.getTitulo())
                .descricao(curso.getDescricao())
                .imagemUrl(curso.getImagemUrl())
                .precoTexto(curso.getPrecoTexto())
                .linkExterno(curso.getLinkExterno())
                .textoBotao(curso.getTextoBotao())
                .ativo(curso.getAtivo())
                .ordem(curso.getOrdem())
                .criadoEm(curso.getCriadoEm())
                .atualizadoEm(curso.getAtualizadoEm())
                .build();
    }
}
