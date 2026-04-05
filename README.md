# Hermes | Mural Digital de Eventos

**Centralização e organização da comunicação entre entidades estudantis e alunos.**

## Problema identificado
Atualmente, a divulgação de eventos, processos seletivos e comunicados importantes das entidades estudantis é fragmentada. Grupos de WhatsApp sofrem com excesso de mensagens (spam), fazendo com que informações cruciais se percam no fluxo, enquanto o e-mail institucional muitas vezes é ignorado ou cai no esquecimento. Não existe um "canal oficial" unificado e fácil de consultar.

## Solução proposta
O **Hermes** (em referência ao deus mensageiro) é uma plataforma web que atua como um mural digital centralizado. Ele permite que administradores publiquem eventos oficiais de forma padronizada e que os alunos filtrem e consumam esse conteúdo com base em seus interesses, garantindo que a mensagem chegue ao destino de forma limpa e confiável.

## Principais funcionalidades
* **Curadoria por Interesses (Tags):** O usuário não é bombardeado com tudo; ele segue tags (ex: "Tecnologia", "Festas", "Esportes") e monta um feed personalizado.
* **Gestão de Eventos Temporais:** Todo post possui data de início e fim, permitindo saber exatamente o que está acontecendo agora e o que já expirou.
* **Permissões Hierárquicas:** Sistema seguro onde apenas Administradores (ADMs) podem publicar, garantindo a veracidade das informações, enquanto Usuários comuns interagem com o conteúdo.
* **Segurança de Dados:** Validação rigorosa de e-mails institucionais (USP) para evitar bots e contas falsas.

## Tecnologias utilizadas
* **Node.js:** Ambiente de execução do backend.
* **PostgreSQL:** Banco de dados relacional robusto para integridade das relações entre Usuários, Posts e Tags.
* **Docker & Docker Compose:** Containerização da aplicação e do banco de dados, garantindo um ambiente padronizado e fácil de rodar em qualquer máquina.
* **Express:** Framework para estruturação da API Rest.
* **React:** Biblioteca para construção de interfaces dinâmicas e reativas no Frontend.
* **Tailwind CSS:** Framework de estilização para um design ágil e responsivo.
* **TypeScript:** Superset do JavaScript que garante tipagem estática e maior segurança no código.
* **Zod:** Validação de esquemas e dados de entrada (Schema Validation).
* **JWT & Crypto:** Autenticação segura e criptografia de identificadores (UUID).

*Desenvolvido pela Equipe USPCodeLab Leste 🩷🤍*

<br>

## Fluxo de Branches

- **Branch principal:** main
- Novas features devem ser criadas a partir da main
- **Padrão de nome:** /nome-feature

**Exemplo:** /auth-login

<br>

**Fluxo:**
1. Criar branch
2. Desenvolver
3. Commitar
4. Merge na main

<br>

## Padrão de Commit

**Formato:** 
tipo: descrição curta

**Tipos:**
- **feat** - Nova funcionalidade
- **fix** - Correção de bug
- **refactor** - Refatoração de código sem mudar comportamento
- **docs** - Alterações apenas em documentação
- **chore** - Tarefas de manutenção que não afetam a lógica principal

**Exemplo:**
feat: Endpoint GET users/me
