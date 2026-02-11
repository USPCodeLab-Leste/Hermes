## ▶️ Como rodar o projeto

<br>

### 1️⃣ Pré-requisitos

Tenha instalado na máquina:

- **Docker**
- **Docker Compose (v1)**

<br>

Verifique:
```bash
docker --version
docker-compose --version
```

<br>

### 2️⃣ Configurar variáveis de ambiente
Renomeie o arquivo .env.example para .env

<br>

### 3️⃣ Subir a aplicação com Docker
Dentro da pasta backend, execute:

```bash
sudo docker-compose up -d --build
```

Isso irá:
- Subir o PostgreSQL
- Criar o banco e as tabelas automaticamente
- Subir a API do backend

<br>

### 4️⃣ Verificar se está rodando
Confira os containers:

```bash
sudo docker ps
```

<br>

Você deve ver:
- hermes_api (backend)
- hermes_db (postgres)  

<br>

## 📚 Documentação da API (Swagger)
Após subir o projeto, a documentação estará disponível em:

> http://localhost:3000/docs

<br>

## 🧪 Logs (debug)

Para ver os logs do backend:
```bash
sudo docker-compose logs backend
```

<br>

Ou em tempo real:
```bash
sudo docker-compose logs -f backend
```

<br>

Para remover o docker-compose
```bash
sudo docker-compose down
```
