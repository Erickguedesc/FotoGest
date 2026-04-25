# OLHARI

A proposta do projeto é desenvolver uma plataforma digital voltada para fotógrafos, reunindo em um único lugar ferramentas para divulgação do trabalho, organização e gestão do negócio. A ideia é facilitar tanto a conexão com clientes quanto a administração dos serviços, tornando o processo mais profissional, organizado e eficiente.

## Alunos integrantes da equipe

* Arthur Nunes Gontijo de Barcellos
* Caio Gabriel de Lima Leal
* Erick Guedes de Carvalho
* Ian Nycolas Fernandes Costa

## Professores responsáveis

* Filipe Torio Lopes Ruas Nhimi
* Leonardo Vilela Cardoso

## Instruções de utilização

# 📘 OLHARI — Guia Completo de Execução do Banco de Dados via Docker

Este guia mostra como subir o banco de dados, conectar o Spring Boot, rodar testes SQL e manter o ambiente sincronizado entre todos os membros da equipe.

---

# 01 — Pré-requisitos

Antes de começar, confirme que você possui:

* 🐳 **Docker Desktop** instalado e em execução
* ☕ **Java 21** instalado (`java -version`)
* 📦 **Maven Wrapper** (`mvnw`) já incluso no projeto
* 💻 **VS Code** com terminal acessível (`Ctrl + J`)
* 📄 arquivo `docker-compose.yml` dentro de `Codigo/backend/`

> ⚠️ O Docker Desktop precisa estar aberto antes de qualquer comando Docker.

---

# 02 — Subir o Banco de Dados

## Entrar na pasta do back-end

```bash
cd Codigo/backend
```

## Subir apenas o banco

```bash
docker compose up olhari-db -d
```

## Verificar se está rodando

```bash
docker compose ps
```

### Resultado esperado

```text
olhari_postgres    Up (healthy)
```

> ✅ Se aparecer `healthy`, o banco está pronto.

---

# 03 — Conectar no Banco de Dados

## Forma 1 — Via terminal (mais rápido)

```bash
docker exec -it olhari_postgres psql -U olhari_user -d olhari_db
```

Quando aparecer:

```text
olhari_db=#
```

você já está dentro do banco.

## Forma 2 — Via Docker Desktop

1. Abrir Docker Desktop
2. Ir em **Containers**
3. Selecionar `olhari_postgres`
4. Abrir aba **Exec**
5. Rodar:

```bash
psql -U olhari_user -d olhari_db
```

## Comandos úteis dentro do psql

| Comando                  | Função              |
| ------------------------ | ------------------- |
| `\dt`                    | Lista tabelas       |
| `\d ensaio`              | Estrutura da tabela |
| `\q`                     | Sai do banco        |
| `SELECT * FROM cliente;` | Ver clientes        |
| `SELECT * FROM ensaio;`  | Ver ensaios         |

---

# 04 — Rodar o Spring Boot

Com o banco rodando, abra um segundo terminal.

## Entrar na pasta

```bash
cd Codigo/backend
```

## Rodar aplicação

```bash
./mvnw spring-boot:run
```

Se der erro no Windows:

```bash
mvnw.cmd spring-boot:run
```

## Resultado esperado

```text
Started BackendApplication
Tomcat started on port 8080
```

## Testar API

```bash
curl http://localhost:8080/actuator/health
```

ou no navegador:

```text
http://localhost:8080/actuator/health
```

### Resultado esperado

```json
{"status":"UP"}
```

> ✅ Banco conectado e API funcionando.

---

# 05 — Testar o Banco de Dados

## Sessão completa de teste

```bash
# 1. Entrar na pasta
cd Codigo/backend

# 2. Subir o banco
docker compose up olhari-db -d

# 3. Verificar status
docker compose ps

# 4. Conectar no banco
docker exec -it olhari_postgres psql -U olhari_user -d olhari_db
```

## Agora dentro do banco

```sql
SELECT * FROM fotografa;
SELECT * FROM cliente;
SELECT * FROM ensaio;
```

## Teste de unicidade (deve dar erro)

```sql
INSERT INTO fotografa (nome, email, senha_hash)
VALUES ('Teste', 'contato@olhari.com', '123');

INSERT INTO fotografa (nome, email, senha_hash)
VALUES ('Invasor', 'contato@olhari.com', '456');
```

## Teste de trigger

```sql
INSERT INTO solicitacao_orcamento (nome_cliente, whatsapp, tipo_ensaio)
VALUES ('Cliente Teste', '31999999999', 'DEBUTANTE');

SELECT nome_cliente, status_lead
FROM solicitacao_orcamento
WHERE nome_cliente = 'Cliente Teste';
```

> ✅ Se der erro no primeiro e retornar `EM_SOLICITACAO` no segundo, está correto.

---

# Verificar se o Spring Boot está salvando

```sql
SELECT
  c.nome AS cliente,
  e.tipo AS tipo,
  e.status AS status,
  e.valor_pacote,
  e.criado_em
FROM ensaio e
JOIN cliente c ON c.id = e.cliente_id
ORDER BY e.criado_em DESC;
```

---

# 06 — Comandos Úteis do Dia a Dia

# Docker — Gerenciar o Banco

```bash
# Subir banco
docker compose up olhari-db -d

# Ver status
docker compose ps

# Parar banco (mantém dados)
docker compose stop

# Logs em tempo real
docker compose logs -f olhari-db

# Reiniciar banco (mantém dados)
docker compose restart olhari-db

# Se ainda não existe container
docker run --name olhari_postgres \
-e POSTGRES_USER=olhari_user \
-e POSTGRES_PASSWORD=olhari_user \
-e POSTGRES_DB=olhari_db \
-p 5432:5432 -d postgres
```

---

# Atualização do Banco (quando o init.sql mudar)

## Método oficial recomendado

```bash
git pull
docker compose down -v (PRIMEIRO)
docker compose up -d (SEGUNDO COMANDO NA ORDEM)
```

## O que isso faz

* recria o container
* recria o PostgreSQL do zero
* executa novamente o `init.sql`
* aplica a nova estrutura atualizada

> ⚠️ Alterar apenas o `init.sql` NÃO atualiza automaticamente o banco já existente.

## Regra prática

**Mudou o banco (`init.sql`) → commit → push → equipe faz pull + reset local do banco**

---

# Rotina diária

```bash
# Terminal 1 — Banco
cd Codigo/backend
docker compose up olhari-db -d

# Terminal 2 — API
cd Codigo/backend
./mvnw spring-boot:run

# Terminal 3 — Consultas
docker exec -it olhari_postgres psql -U olhari_user -d olhari_db
```

Ao terminar:

```bash
# parar Spring Boot
Ctrl + C

# parar banco mantendo dados
docker compose stop
```

---

# 🚨 Importante

Nunca use:

```bash
docker compose down -v
```

durante o desenvolvimento normal sem necessidade.

Esse comando apaga todos os dados do banco.

Use apenas quando houver mudança estrutural no `init.sql`.

No dia a dia, prefira:

```bash
docker compose stop
```

---

# ✅ Resumo Final

### Desenvolvimento normal

```bash
docker compose up -d
./mvnw spring-boot:run
```

### Mudança no banco (`init.sql`)

```bash
git pull
docker compose down -v
docker compose up -d
```

Esse é o fluxo oficial da Sprint 3 do projeto OLHARI.
