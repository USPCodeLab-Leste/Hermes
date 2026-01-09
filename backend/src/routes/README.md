# Endpoints da API

## Auth

**POST /auth/register**
Cria um novo usuário (email ainda não confirmado).

Entrada:
```json
{  
  "nome": "Usuario",
  "email": "usuario@usp.br",
  "password": "123456"
}
```

Saída (201):
```json
{
  "message": "Usuário criado",
  "id": "uuid"
}
```

--- 

**POST /auth/login**
Autentica o usuário.

Entrada:
```json
{
  "email": "usuario@usp.br",
  "password": "123456"
}
```

Saída (200):
```json
{
  "token": "jwt_token"
}
```

---

**GET /auth/verify-email?token=XYZ**
Confirma o email do usuário.

Saída (200):
```json
{
  "message": "Email verificado"
}
```

---

## Usuario

### Autorização

Todas as rotas abaixo exigem token JWT no header.
O token identifica o usuário autenticado e é validado pelo backend em todas as requisições protegidas:
``Authorization: Bearer <token>``

**Exemplo de requisição autenticada (Frontend)**

```js
const token = localStorage.getItem("token");

fetch("http://localhost:3000/users/me", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  }
});
```

<br>

**GET /users/me**
Retorna os dados do usuário autenticado.

Resposta (200):
```json
{
  "id": "uuid",
  "nome": "Usuario",
  "email": "usuario@usp.br",
  "role": "USER",
  "...": "..."
}
```