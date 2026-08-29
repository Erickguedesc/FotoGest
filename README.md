# Fotolhar

Fotolhar é um sistema web de gestão para fotógrafos, pensado para organizar o fluxo de trabalho de ensaios, clientes, álbuns, fotos, seleção de imagens, configurações profissionais e acompanhamento do negócio.

Este repositório é mantido separadamente para evolução do Fotolhar como produto voltado ao mercado.

## Tecnologias

### Backend
- Java 21
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- PostgreSQL
- Docker
- Cloudinary

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router

## Estrutura do projeto

~~~text
Fotolhar/
├── Codigo/
│   ├── backend/
│   └── frontend/
├── Documentacao/
├── Artefatos/
├── Divulgacao/
├── README.md
└── CITATION.cff
~~~

## Executando o backend com Docker

Entre na pasta do backend:

~~~bash
cd Codigo/backend
~~~

Suba o banco de dados:

~~~bash
docker compose up fotolhar-db -d
~~~

Verifique os containers:

~~~bash
docker compose ps
~~~

Acesse o banco via terminal:

~~~bash
docker exec -it fotolhar_postgres psql -U fotolhar_user -d fotolhar_db
~~~

Para subir a API junto com o banco:

~~~bash
docker compose up --build
~~~

A API ficará disponível em:

~~~text
http://localhost:8080
~~~

## Executando o frontend

Entre na pasta do frontend:

~~~bash
cd Codigo/frontend
~~~

Instale as dependências:

~~~bash
npm ci
~~~

Execute o projeto:

~~~bash
npm run dev
~~~

O frontend ficará disponível, por padrão, em:

~~~text
http://localhost:5173
~~~

## Build do frontend

~~~bash
npm run build
~~~

## Build do backend

Na pasta `Codigo/backend`, execute:

~~~bash
./mvnw clean package -DskipTests
~~~

## Observação sobre a migração

O Fotolhar é mantido para permitir evolução independente, com mudanças de marca, site institucional, regras de negócio e funcionalidades voltadas ao uso por diferentes fotógrafos no mercado.
