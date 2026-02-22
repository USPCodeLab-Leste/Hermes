## ▶️ Como rodar o projeto

<br>

### 1️⃣ Pré-requisitos

Tenha instalado na máquina:

- **Docker (Engine v29+)**
- **Docker Compose (v2, via docker compose)**

<br>

Verifique:
```bash
docker --version
docker compose --version
```

<br>

### 2️⃣ Configurar variáveis de ambiente
Renomeie o arquivo .env.example para .env

<br>

### 3️⃣ Subir a aplicação com Docker
O projeto utiliza dois arquivos Docker Compose:

<br>

- `docker-compose.yml`: configuração principal, define todos os serviços necessários, incluindo backend, banco de dados e nginx.
- `docker-compose.override.yml`: usado no desenvolvimento para mapear o código local e habilitar hot reload no backend.

<br>

Para rodar no modo desenvolvimento, basta executar:

```bash
docker compose up -d --build
```

<br>

Para subir apenas o ambiente de produção:

```bash
docker compose -f docker-compose.yml up -d --build
```

Isso irá:
- Subir o PostgreSQL
- Criar o banco e as tabelas automaticamente
- Subir a API do backend

<br>

### 4️⃣ Verificar se está rodando
Confira os containers:

```bash
docker ps
```

<br>

## 📚 Documentação da API (Swagger)
Após subir o projeto, a documentação estará disponível em:

> http://localhost/docs

<br>

## 🧪 Logs (debug)

Para ver os logs do backend:
```bash
docker compose logs backend
```

<br>

Ou em tempo real:
```bash
docker compose logs -f backend
```

<br>

Para parar e remover containers, volumes e rede
```bash
docker compose down -v
```
