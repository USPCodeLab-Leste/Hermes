# Endpoints da API

<br>

## Auth

**POST /auth/register** <br>
Cria um novo usuário (email ainda não confirmado). <br>

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

**POST /auth/login** <br>
Autentica o usuário. <br>

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

**GET /auth/verify-email?token=XYZ** <br>
Confirma o email do usuário. <br>

Saída (200):
```json
{
  "message": "Email verificado"
}
```



<br><br>

## Usuario

<br>

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

**GET /users/me** <br>
Retorna os dados do usuário autenticado. <br>

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

--- 

<br>

**PATCH /users/me** <br>
Atualiza parcialmente os dados do usuário autenticado (**apenas o nome por enquanto**). <br>

Entrada:
```json
{
  "name": "Novo Nome"
}
```

Resposta (200):
```json
{
  "message": "Usuário atualizado com sucesso",
  "user": {
    "id": "uuid",
    "name": "Novo Nome",
    "email": "usuario@usp.br",
    "role": "USER"
  }
}
```