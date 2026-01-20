# Endpoints da API

## Auth

**POST /auth/register**
Cria um novo usuário (email ainda não confirmado).

Entrada:
```json
{  
  "name": "Usuario",
  "email": "usuario@usp.br",
  "password": "12345678" // min 8 caracteres
}
```

Saída (201):
```json
{
  "message": "Usuário criado",
  "userId": "uuid"
}
```

--- 

**POST /auth/login**
Autentica o usuário.

Entrada:
```json
{
  "email": "usuario@usp.br",
  "password": "12345678"
}
```

Saída (200):
```json
{
  "message": "Login realizado com sucesso"
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

Todas as rotas abaixo exigem que o usuário esteja autenticado.
A autenticação é feita através de um **JWT armazenado em cookie HttpOnly**, enviado automaticamente pelo navegador em cada requisição.

- Não é necessário (nem possível) acessar o token via JavaScript.  

### Exemplo de requisição autenticada (Frontend)

```js
fetch("http://localhost:3000/users/me", {
  method: "GET",
  credentials: "include"
});
```

--- 

<br>

**GET /users/me**
Retorna os dados do usuário autenticado.

Resposta (200):
```json
{
  "id": "uuid",
  "name": "Usuario",
  "email": "usuario@usp.br",
  "role": "USER",
  "...": "..."
}
```