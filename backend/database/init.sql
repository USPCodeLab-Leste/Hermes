-- habilita extensao para UUID (caso o banco precise gerar, mas estamos gerando no node)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- tabela de usuarios
CREATE TABLE IF NOT EXISTS tb_user (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student'
);

--  tabela de tags (com type e name)
CREATE TABLE IF NOT EXISTS tb_tag (
    id UUID PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, 
    active BOOLEAN DEFAULT TRUE
);

--  tabela de Posts (unificada: Eventos e Infos)
CREATE TABLE IF NOT EXISTS tb_post (
    id UUID PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    body TEXT NOT NULL,
    local VARCHAR(100),           -- opcional (para Infos)
    data_inicio TIMESTAMP,        -- opcional (para Infos)
    data_fim TIMESTAMP,           -- opcional (para Infos)
    img_banner TEXT,
    status VARCHAR(20) DEFAULT 'published',
    autor_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (autor_id) REFERENCES tb_user(id)
);

-- tabela pivo (Post <-> Tag)
CREATE TABLE IF NOT EXISTS tb_post_tag (
    post_id UUID REFERENCES tb_post(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tb_tag(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);