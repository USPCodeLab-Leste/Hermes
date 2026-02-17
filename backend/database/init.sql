-- habilita extensao para UUID (caso o banco precise gerar, mas estamos gerando no node)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- tabela de usuarios
CREATE TABLE IF NOT EXISTS tb_user (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    is_verified BOOLEAN DEFAULT FALSE
);

--  tabela de tags (com type e name)
CREATE TABLE IF NOT EXISTS tb_tag (
    id UUID PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, 
    active BOOLEAN DEFAULT TRUE
);

--  tabela de Content
CREATE TABLE IF NOT EXISTS tb_content (
    id UUID PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'post',
    local VARCHAR(100),           -- opcional
    data_inicio TIMESTAMP,        -- opcional
    data_fim TIMESTAMP,           -- opcional
    img_banner TEXT,              -- opcional
    status VARCHAR(20) DEFAULT 'published',
    autor_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (autor_id) REFERENCES tb_user(id)
);

-- tabela pivo (content <-> Tag)
CREATE TABLE IF NOT EXISTS tb_content_tag (
    content_id UUID REFERENCES tb_content(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tb_tag(id) ON DELETE CASCADE,
    PRIMARY KEY (content_id, tag_id)
);

-- tabela pivô (User <-> Tag) = tags favoritas
CREATE TABLE IF NOT EXISTS tb_user_tag (
    user_id UUID REFERENCES tb_user(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tb_tag(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, tag_id)
);
