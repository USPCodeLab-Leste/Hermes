# RELATÓRIO DO HERMES API

## Relato das divergências entre a documentação e os testes

------------------------------------------------------------------------

## Auth

Rota de cadastro e login do usuário, além da renovação da sua chave
principal.

### POST (/auth/register)

Cadastro de um novo usuário.

#### Testes realizados:

-   Seguindo o modelo de entrada padrão;
-   Tentar cadastrar um e-mail já existente;
-   Tentar cadastrar sem escrever a senha;
-   Tentar cadastrar com senha menor que 8 caracteres;
-   Tentar cadastrar um e-mail diferente de "@usp.br";
-   Tentar cadastrar um e-mail sem o "@";
-   Tentar cadastrar sem escrever um nome;
-   Tentar cadastrar com nome menor que 3 letras.

Caso o usuário desrespeite alguma das regras impostas na documentação, o
sistema retorna o erro correspondente corretamente.

------------------------------------------------------------------------

### POST (/auth/login)

Inicia a sessão do usuário.

#### Testes realizados:

-   Seguindo o modelo de entrada padrão;
-   Tentar entrar com e-mail não cadastrado;
-   Tentar entrar com senha incorreta;
-   Tentar com o campo de e-mail vazio;
-   Tentar com o campo de senha vazio.

Os testes demonstraram que a aplicação retorna as respostas corretas de
erro e sucesso em cada caso.

------------------------------------------------------------------------

### GET (/auth/refresh)

Renova o token de acesso.

Funcionando corretamente, sem empecilhos.

------------------------------------------------------------------------

### POST (/auth/logout)

Finaliza a sessão do usuário.

Funcionando corretamente.

------------------------------------------------------------------------

### PATCH (/auth/change-password)

Atualiza a senha do usuário.

#### Testes realizados:

-   Modelo padrão;
-   Senha antiga incorreta;
-   Nova senha vazia;
-   Nova senha fora dos padrões.

Todos os testes obtiveram sucesso.

**Ponto a destacar:** O backend poderia reforçar a verificação de
requisitos mínimos de segurança da senha (ex: tamanho mínimo, caracteres
especiais, etc.).

------------------------------------------------------------------------

## Events

### POST (/events)

Criação de novos eventos (restrito a administradores).

#### Testes realizados:

-   Tentar criar sem ser administrador;
-   Criar usando modelo padrão;
-   Tentar criar sem título;
-   Tentar criar sem body;
-   Tentar criar sem local;
-   Tentar criar sem data inicial;
-   Tentar criar sem data final;
-   Tentar criar sem imagem;
-   Tentar criar sem lista de tags;
-   Tentar criar o mesmo evento duas ou mais vezes.

Todos os testes funcionaram conforme esperado, exceto o último, pois é
possível criar o mesmo evento múltiplas vezes (problema de duplicidade).

------------------------------------------------------------------------

### GET (/events)

Lista de eventos.

#### Testes realizados:

-   Sem eventos;
-   Com eventos, sem filtro;
-   Com filtro por título;
-   Com filtro por tags;
-   Com filtros combinados (título + tags).

Não apresentou anormalidades em relação à documentação.

------------------------------------------------------------------------

## Info

### POST (/infos)

Cadastro de blocos de informação (restrito a administradores).

#### Testes realizados:

-   Tentar criar sem ser administrador;
-   Criar usando modelo padrão;
-   Tentar criar sem título;
-   Tentar criar sem body;
-   Tentar criar sem lista de tags;
-   Tentar criar o mesmo evento duas ou mais vezes.

Assim como em Events, é possível criar informações duplicadas.

------------------------------------------------------------------------

### GET (/infos)

Lista de blocos de informação.

#### Testes realizados:

-   Sem registros;
-   Com registros, sem filtro;
-   Com filtro por título;
-   Com filtro por tags;
-   Com filtros combinados.

O filtro por tags não está funcionando corretamente.

------------------------------------------------------------------------

## Tags

### GET (/tags)

Lista todas as tags ativas.

Funcionando corretamente.

------------------------------------------------------------------------

### GET (/tags/{name})

Busca uma tag específica.

Funcionando corretamente.

------------------------------------------------------------------------

### POST (/tags)

É obrigatório escrever algum texto, porém não há validação de tamanho
mínimo acima de 1 caractere.

------------------------------------------------------------------------

## User

### GET (/users/me)

Retorna os dados do usuário com base no token.

A documentação indica que apenas administradores teriam acesso, porém a
rota retorna os dados do próprio usuário autenticado. Provavelmente
trata-se de erro na documentação.

------------------------------------------------------------------------

### PATCH (/users/me)

Atualiza os dados do usuário (atualmente apenas o nome).

#### Testes realizados:

-   Nome padrão;
-   Campo vazio;
-   Nome com menos de 3 caracteres.

A aplicação retorna erro, mas a mensagem não explica claramente o
motivo. Poderia haver mensagens mais explícitas para evitar confusão.

Também é possível utilizar um nome já existente no banco.

------------------------------------------------------------------------

### POST (/users/me/tags)

Quando é enviada uma tag inexistente, é retornado um erro genérico, sem
indicar claramente se é erro de servidor ou tag não encontrada.

------------------------------------------------------------------------

### DELETE (/users/me/tags/{tagId})

Funcionando corretamente.

------------------------------------------------------------------------

## Observações Gerais

-   A verificação de administrador e autenticação está funcionando
    adequadamente.
-   O controle para que o usuário apenas atualize e delete seus próprios
    dados está correto.

------------------------------------------------------------------------

## Sugestões

-   Aplicar middleware de autenticação em todas as rotas para evitar
    abusos e possíveis ataques (ex: DDOS).
-   Implementar tratamento para usuários que não confirmam o e-mail até
    a data limite (7 dias).
-   No POST /auth/register, caso o envio de e-mail falhe, o usuário
    ainda é criado no banco. Essa exceção deve ser tratada para evitar
    inconsistência de dados.
