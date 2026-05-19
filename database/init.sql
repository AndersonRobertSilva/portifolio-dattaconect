-- DATTA CONECT - ÁREA DE MEMBROS - DB INIT
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'aluno' CHECK (role IN ('aluno', 'admin')),
    avatar_url TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    descricao_curta VARCHAR(300),
    thumbnail_url TEXT,
    nivel VARCHAR(30) DEFAULT 'Iniciante',
    duracao VARCHAR(50),
    categoria VARCHAR(100),
    preco DECIMAL(10,2) DEFAULT 0.00,
    ativo BOOLEAN DEFAULT TRUE,
    destaque BOOLEAN DEFAULT FALSE,
    ordem INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    ordem INT DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    video_url TEXT,
    duracao VARCHAR(20),
    ordem INT DEFAULT 0,
    gratuita BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    progresso DECIMAL(5,2) DEFAULT 0.00,
    data_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_conclusao TIMESTAMP,
    UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS user_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    concluido BOOLEAN DEFAULT FALSE,
    data_conclusao TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_user_courses_user ON user_courses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lessons_user ON user_lessons(user_id);

-- Admin padrão (senha: admin123)
INSERT INTO users (nome, email, senha_hash, role) VALUES
('Administrador', 'admin@dattaconect.com.br', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Cursos de exemplo
INSERT INTO courses (id, titulo, descricao, descricao_curta, nivel, duracao, categoria, destaque, ordem) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Power BI do Zero ao Avançado', 'Aprenda a criar dashboards profissionais com Power BI. Do básico ao avançado, com projetos práticos.', 'Domine o Power BI com projetos práticos.', 'Iniciante', '40 horas', 'Business Intelligence', TRUE, 1),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'SQL para Análise de Dados', 'Domine SQL do básico ao avançado para extrair insights poderosos de qualquer base de dados.', 'Extraia insights com SQL.', 'Intermediário', '30 horas', 'Dados & Analytics', TRUE, 2),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Dashboard com Google Sheets', 'Transforme o Google Sheets em ferramenta poderosa de BI com dashboards interativos.', 'Dashboards interativos no Google Sheets.', 'Iniciante', '20 horas', 'Produtividade', FALSE, 3),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'Python para Automação de Dados', 'Automatize tarefas e crie pipelines de dados com Python, Pandas e APIs.', 'Automatize dados com Python.', 'Avançado', '35 horas', 'Programação', TRUE, 4)
ON CONFLICT DO NOTHING;

-- Módulos Power BI
INSERT INTO modules (id, course_id, titulo, descricao, ordem) VALUES
('11000001-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Introdução ao Power BI', 'Primeiros passos', 1),
('11000002-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Fontes de Dados', 'Importação e transformação', 2),
('11000003-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Visualizações', 'Gráficos e painéis', 3),
('11000004-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'DAX Avançado', 'Fórmulas avançadas', 4)
ON CONFLICT DO NOTHING;

-- Módulos SQL
INSERT INTO modules (id, course_id, titulo, descricao, ordem) VALUES
('21000001-0000-0000-0000-000000000001', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Fundamentos do SQL', 'SELECT, WHERE, ORDER BY', 1),
('21000002-0000-0000-0000-000000000002', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Joins e Relacionamentos', 'INNER, LEFT, RIGHT JOIN', 2)
ON CONFLICT DO NOTHING;

-- Aulas Power BI Mod 1
INSERT INTO lessons (id, module_id, titulo, descricao, video_url, duracao, ordem, gratuita) VALUES
('12000001-0000-0000-0000-000000000001', '11000001-0000-0000-0000-000000000001', 'Bem-vindo ao Curso', 'Apresentação', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '10 min', 1, TRUE),
('12000002-0000-0000-0000-000000000002', '11000001-0000-0000-0000-000000000001', 'Instalando o Power BI', 'Download e configuração', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '15 min', 2, TRUE),
('12000003-0000-0000-0000-000000000003', '11000001-0000-0000-0000-000000000001', 'Interface e Navegação', 'Conhecendo a interface', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '20 min', 3, FALSE)
ON CONFLICT DO NOTHING;

-- Aulas Power BI Mod 2
INSERT INTO lessons (id, module_id, titulo, descricao, video_url, duracao, ordem, gratuita) VALUES
('12000004-0000-0000-0000-000000000004', '11000002-0000-0000-0000-000000000002', 'Conectando ao Excel', 'Importando planilhas', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '18 min', 1, FALSE),
('12000005-0000-0000-0000-000000000005', '11000002-0000-0000-0000-000000000002', 'Conectando ao SQL Server', 'Conexão com banco', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '22 min', 2, FALSE)
ON CONFLICT DO NOTHING;

-- Aulas SQL Mod 1
INSERT INTO lessons (id, module_id, titulo, descricao, video_url, duracao, ordem, gratuita) VALUES
('22000001-0000-0000-0000-000000000001', '21000001-0000-0000-0000-000000000001', 'O que é SQL?', 'Introdução à linguagem', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '12 min', 1, TRUE),
('22000002-0000-0000-0000-000000000002', '21000001-0000-0000-0000-000000000001', 'SELECT e FROM', 'Primeira consulta', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '18 min', 2, TRUE)
ON CONFLICT DO NOTHING;

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = CURRENT_TIMESTAMP; RETURN NEW; END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
