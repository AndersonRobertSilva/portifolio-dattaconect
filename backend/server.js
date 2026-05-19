require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dattaconect_secret_key_2026';

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://datta:datta123@db:5432/dattaconect'
});

app.use(cors());
app.use(express.json());

// ============================================
// MIDDLEWARE: Auth
// ============================================
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token não fornecido' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ error: 'Token inválido' });
    }
}

function adminMiddleware(req, res, next) {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso negado' });
    next();
}

// ============================================
// AUTH ROUTES
// ============================================
app.post('/api/auth/register', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        if (!nome || !email || !senha) return res.status(400).json({ error: 'Campos obrigatórios' });
        const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (exists.rows.length > 0) return res.status(409).json({ error: 'Email já cadastrado' });
        const senha_hash = await bcrypt.hash(senha, 10);
        const result = await pool.query(
            'INSERT INTO users (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email, role',
            [nome, email, senha_hash]
        );
        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role, nome: user.nome }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1 AND ativo = TRUE', [email]);
        if (result.rows.length === 0) return res.status(401).json({ error: 'Credenciais inválidas' });
        const user = result.rows[0];
        const valid = await bcrypt.compare(senha, user.senha_hash);
        if (!valid) return res.status(401).json({ error: 'Credenciais inválidas' });
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role, nome: user.nome }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, nome: user.nome, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno' });
    }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nome, email, role, avatar_url, created_at FROM users WHERE id = $1', [req.user.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

// ============================================
// COURSES (Public + Admin)
// ============================================
app.get('/api/courses', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM courses WHERE ativo = TRUE ORDER BY ordem');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

app.get('/api/courses/:id', async (req, res) => {
    try {
        const course = await pool.query('SELECT * FROM courses WHERE id = $1', [req.params.id]);
        if (course.rows.length === 0) return res.status(404).json({ error: 'Curso não encontrado' });
        const modules = await pool.query('SELECT * FROM modules WHERE course_id = $1 AND ativo = TRUE ORDER BY ordem', [req.params.id]);
        const modulesWithLessons = [];
        for (const mod of modules.rows) {
            const lessons = await pool.query('SELECT id, titulo, descricao, duracao, ordem, gratuita FROM lessons WHERE module_id = $1 AND ativo = TRUE ORDER BY ordem', [mod.id]);
            modulesWithLessons.push({ ...mod, lessons: lessons.rows });
        }
        res.json({ ...course.rows[0], modules: modulesWithLessons });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

// Admin: CRUD Courses
app.post('/api/admin/courses', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { titulo, descricao, descricao_curta, nivel, duracao, categoria, preco, destaque } = req.body;
        const result = await pool.query(
            'INSERT INTO courses (titulo, descricao, descricao_curta, nivel, duracao, categoria, preco, destaque) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
            [titulo, descricao, descricao_curta, nivel || 'Iniciante', duracao, categoria, preco || 0, destaque || false]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

app.put('/api/admin/courses/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { titulo, descricao, descricao_curta, nivel, duracao, categoria, preco, destaque, ativo } = req.body;
        const result = await pool.query(
            'UPDATE courses SET titulo=$1, descricao=$2, descricao_curta=$3, nivel=$4, duracao=$5, categoria=$6, preco=$7, destaque=$8, ativo=$9 WHERE id=$10 RETURNING *',
            [titulo, descricao, descricao_curta, nivel, duracao, categoria, preco, destaque, ativo, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

app.delete('/api/admin/courses/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM courses WHERE id = $1', [req.params.id]);
        res.json({ message: 'Curso removido' });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

// ============================================
// MODULES (Admin)
// ============================================
app.post('/api/admin/modules', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { course_id, titulo, descricao, ordem } = req.body;
        const result = await pool.query(
            'INSERT INTO modules (course_id, titulo, descricao, ordem) VALUES ($1,$2,$3,$4) RETURNING *',
            [course_id, titulo, descricao, ordem || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

app.put('/api/admin/modules/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { titulo, descricao, ordem, ativo } = req.body;
        const result = await pool.query(
            'UPDATE modules SET titulo=$1, descricao=$2, ordem=$3, ativo=$4 WHERE id=$5 RETURNING *',
            [titulo, descricao, ordem, ativo, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

app.delete('/api/admin/modules/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM modules WHERE id = $1', [req.params.id]);
        res.json({ message: 'Módulo removido' });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

// ============================================
// LESSONS (Admin + Members)
// ============================================
app.post('/api/admin/lessons', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { module_id, titulo, descricao, video_url, duracao, ordem, gratuita } = req.body;
        const result = await pool.query(
            'INSERT INTO lessons (module_id, titulo, descricao, video_url, duracao, ordem, gratuita) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [module_id, titulo, descricao, video_url, duracao, ordem || 0, gratuita || false]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

app.put('/api/admin/lessons/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { titulo, descricao, video_url, duracao, ordem, gratuita, ativo } = req.body;
        const result = await pool.query(
            'UPDATE lessons SET titulo=$1, descricao=$2, video_url=$3, duracao=$4, ordem=$5, gratuita=$6, ativo=$7 WHERE id=$8 RETURNING *',
            [titulo, descricao, video_url, duracao, ordem, gratuita, ativo, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

app.delete('/api/admin/lessons/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM lessons WHERE id = $1', [req.params.id]);
        res.json({ message: 'Aula removida' });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

// Get lesson detail (for members)
app.get('/api/lessons/:id', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM lessons WHERE id = $1 AND ativo = TRUE', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Aula não encontrada' });
        const lesson = result.rows[0];
        // Check if free or user enrolled
        if (!lesson.gratuita) {
            const mod = await pool.query('SELECT course_id FROM modules WHERE id = $1', [lesson.module_id]);
            const enrolled = await pool.query('SELECT id FROM user_courses WHERE user_id = $1 AND course_id = $2', [req.user.id, mod.rows[0].course_id]);
            if (enrolled.rows.length === 0 && req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Matricule-se no curso para acessar' });
            }
        }
        res.json(lesson);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

// ============================================
// ENROLLMENT & PROGRESS
// ============================================
app.post('/api/courses/:id/enroll', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            'INSERT INTO user_courses (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
            [req.user.id, req.params.id]
        );
        res.status(201).json({ message: 'Matriculado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

app.get('/api/my-courses', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.*, uc.progresso, uc.data_inicio
            FROM user_courses uc
            JOIN courses c ON c.id = uc.course_id
            WHERE uc.user_id = $1 ORDER BY uc.data_inicio DESC
        `, [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

app.post('/api/lessons/:id/complete', authMiddleware, async (req, res) => {
    try {
        await pool.query(
            'INSERT INTO user_lessons (user_id, lesson_id, concluido, data_conclusao) VALUES ($1,$2,TRUE,CURRENT_TIMESTAMP) ON CONFLICT (user_id, lesson_id) DO UPDATE SET concluido = TRUE, data_conclusao = CURRENT_TIMESTAMP',
            [req.user.id, req.params.id]
        );
        // Update course progress
        const lesson = await pool.query('SELECT m.course_id FROM lessons l JOIN modules m ON m.id = l.module_id WHERE l.id = $1', [req.params.id]);
        if (lesson.rows.length > 0) {
            const courseId = lesson.rows[0].course_id;
            const total = await pool.query('SELECT COUNT(*) FROM lessons l JOIN modules m ON m.id = l.module_id WHERE m.course_id = $1 AND l.ativo = TRUE', [courseId]);
            const done = await pool.query('SELECT COUNT(*) FROM user_lessons ul JOIN lessons l ON l.id = ul.lesson_id JOIN modules m ON m.id = l.module_id WHERE m.course_id = $1 AND ul.user_id = $2 AND ul.concluido = TRUE', [courseId, req.user.id]);
            const progress = (parseInt(done.rows[0].count) / parseInt(total.rows[0].count) * 100).toFixed(2);
            await pool.query('UPDATE user_courses SET progresso = $1 WHERE user_id = $2 AND course_id = $3', [progress, req.user.id, courseId]);
        }
        res.json({ message: 'Aula concluída' });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

app.get('/api/courses/:id/progress', authMiddleware, async (req, res) => {
    try {
        const completedLessons = await pool.query(`
            SELECT ul.lesson_id FROM user_lessons ul
            JOIN lessons l ON l.id = ul.lesson_id
            JOIN modules m ON m.id = l.module_id
            WHERE m.course_id = $1 AND ul.user_id = $2 AND ul.concluido = TRUE
        `, [req.params.id, req.user.id]);
        const enrollment = await pool.query('SELECT progresso FROM user_courses WHERE user_id = $1 AND course_id = $2', [req.user.id, req.params.id]);
        res.json({
            completedLessons: completedLessons.rows.map(r => r.lesson_id),
            progresso: enrollment.rows.length > 0 ? enrollment.rows[0].progresso : 0
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

// ============================================
// ADMIN: Users management
// ============================================
app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nome, email, role, ativo, created_at FROM users ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

app.get('/api/admin/stats', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['aluno']);
        const courses = await pool.query('SELECT COUNT(*) FROM courses WHERE ativo = TRUE');
        const enrollments = await pool.query('SELECT COUNT(*) FROM user_courses');
        const lessons = await pool.query('SELECT COUNT(*) FROM lessons WHERE ativo = TRUE');
        res.json({
            totalAlunos: parseInt(users.rows[0].count),
            totalCursos: parseInt(courses.rows[0].count),
            totalMatriculas: parseInt(enrollments.rows[0].count),
            totalAulas: parseInt(lessons.rows[0].count)
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
