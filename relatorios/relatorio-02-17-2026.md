# RELATÓRIO DO HERMES API
## Relato das divergência entre a documentação e os testes
### Auth
Rota de cadastro e login do usuário, além da renovação da sua chave principal
#### Post (/auth/register)
Cadastro de um novo usuário.
##### Testes
Os testes realizados foram:
- seguindo o modelo de entrada padrão;
- tentar cadastrar um email já existente;
- tentar cadastrar sem escrever a senha;
- tentar cadastrar em que a senha tenha menos de 8 caracteres;
- tentar cadastrar um email diferente do "@usp.br";
- tentar cadastrar um email sem o "@";
- tentar cadastrar sem escrevendo um nome;
- tentar cadastrar em que o nome tem menos de 3 letras.

Caso o usuário desrrespeite uma das regras impostas na documentação é exposto o devido erro e enviado a devida resposta.

#### Post (/auth/login)
Inicia a sessão do usuário.
##### Testes
Os testes realizados foram:
- seuindo o modelo de entrada padrão;
- tentar entrar com um email não cadastrado;
- tentar entrar com a senha diferente do email cadastrado;
- tentar com o campo de email vazio;
- tentar com o campo de senha vazia.

Os testes demonstra que a aplicação restorna as devidas respostas de erro e de sucesso de cada caso.

#### GET (/auth/refresh)
Renova o token de acesso.

Ele renova o token sem nenhum empecilho

### Events
#### POST (/events)
Criação de novos eventos, restritos à aos administradores.
##### Testes
Os testes realizados foram:
- Tentar criar não sendo um administrador;
- Criar usando o modelo padrão;
- Tentar criar sem um título;
- Tentar criar sem um body;
- Tentar criar sem um local;
- Tentar criar sem uma data inicial;
- Tentar criar sem uma data final;
- Tentar criar sem um caminho para uma imagem;
- Tentar criar sem colocar uma lista de tags;
- Tentar criar o mesmo eventos duas ou mais vezes;

Quase todos os testes foram bem sucessidos, mostrando o esperado, mas o último acaba sendo um problema, pois é capaz de criar o mesmo evento várias vezes.

#### GET (/events)
Lista de eventos
##### Teste
Os testes realizados foram:
- Sem nenhum evento;
- Com eventos, mas sem filtro;
- Com eventos, mas com o filtro de títulos;
- Com eventos, mas com o filtro das tags;
- Com eventos, mas com os filtros de tags e títulos.

Não apresentou nenhuma anormalia em relação à documentação.

### Info
#### POST (/infos)
Cadastro de blocos de informações, restritos à aos administradores.
##### Testes
Os testes realizados foram:
- Tentar criar não sendo um administrador;
- Criar usando o modelo padrão;
- Tentar criar sem um título;
- Tentar criar sem um body;
- Tentar criar sem colocar uma lista de tags;
- Tentar criar o mesmo eventos duas ou mais vezes.

Quase todos os testes foram bem sucessidos, mostrando o esperado, mas o último acaba sendo um problema, pois é capaz de criar o mesmo evento várias vezes.

#### GET (/infos)
Lista de blocos de informação
##### Teste
Os testes realizados foram:
- Sem nenhum evento;
- Com eventos, mas sem filtro;
- Com eventos, mas com o filtro de títulos;
- Com eventos, mas com o filtro das tags;
- Com eventos, mas com os filtros de tags e títulos.

O filtro das tags não está funcionando.

### Tags
#### GET (/tags)
Listas todas as tags ativas.
Em funcionamento

#### GET (/tags/{name})
Pesquisa de uma tag. 
Em funcionamento.

#### POST (/tags)
É obrigado à escrever algum texto, mas não tem um mínimo de caracteres acima de 1.

### User
#### GET (/users/me)
Retorna os dados do usuário baseado no seu Token

Na documentação está indicando que era para somente os admnistradores terem acesso, embora ainda traz os dados do usuário.
Possivelmente seja erro da documentação.

#### PATCH (/users/me)
Atualiza os dados do usuário, atualmente sendo somente o nome.
##### Testes
Os testes realizados forma:
- Nome padrão da documentação;
- Campo do nome vazio;
- Campo do nome com menos de 3 caracteres.

A aplicação devolve uma mensagem de erro, mas não explica claramente o motivo. O erro poderia ser explicito para evitar confusões.
É possível se dar um nome já existente no banco.

#### POST (/users/me/tags)
Quando é postado uma tag que não existe, é retornado um erro qualquer, não indicando um erro de servidor ou a tag não foi encontrada.

#### DELETE (/users/me/tags/{tagId})
Funciona perfeitamente.