const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
app.use(cors({origin: 'https://crisom-musicc.vercel.app/'}));
app.use(express.json());
app.use('/audio', express.static(path.join(__dirname, '../site/audio')));
app.use('/imagens', express.static(path.join(__dirname, '../site/imagens')));

const db = new Database(path.join(__dirname, 'crimsonecho.db'));

db.exec(`
CREATE TABLE IF NOT EXISTS musicas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  duracao TEXT NOT NULL,
  arquivo TEXT,
  thumb TEXT
);

CREATE TABLE IF NOT EXISTS shows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  local TEXT NOT NULL,
  data TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS comentarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  criado_em TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contatos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  criado_em TEXT DEFAULT (datetime('now'))
);
`);

const musicasCount = db.prepare('SELECT COUNT(*) AS c FROM musicas').get().c;
if (musicasCount === 0) {
  const insertMusica = db.prepare('INSERT INTO musicas (titulo, duracao, arquivo, thumb) VALUES (?, ?, ?, ?)');
  insertMusica.run('Lâmina de Aço', 'Duração 5:36', '/audio/Lâmina_de_Aço-Celtic.mp3', '/imagens/download (4).jpg');
  insertMusica.run('Reino Esquecido', 'Duração 4:52', '/audio/Reino_Esquecido-Glória.mp3', '/imagens/download (5).jpg');
  insertMusica.run('Ecos da Batalha', 'Duração 4:19', '/audio/Ecos_da_Batalha.mp3', '/imagens/download (8).jpg');
}

const showsCount = db.prepare('SELECT COUNT(*) AS c FROM shows').get().c;
if (showsCount === 0) {
  const insertShow = db.prepare('INSERT INTO shows (local, data) VALUES (?, ?)');
  insertShow.run('Palmas, TO', '20/07/2026');
  insertShow.run('Goiânia, GO', '03/08/2026');
}

app.get('/api/musicas', (req, res) => {
  const musicas = db.prepare('SELECT * FROM musicas').all();
  res.json(musicas);
});

app.get('/api/shows', (req, res) => {
  const shows = db.prepare('SELECT * FROM shows').all();
  res.json(shows);
});

app.get('/api/comentarios', (req, res) => {
  const comentarios = db.prepare('SELECT * FROM comentarios ORDER BY id DESC').all();
  res.json(comentarios);
});

app.post('/api/comentarios', (req, res) => {
  const { nome, mensagem } = req.body;
  if (!nome || !mensagem) {
    return res.status(400).json({ erro: 'Nome e mensagem são obrigatórios.' });
  }
  const result = db.prepare('INSERT INTO comentarios (nome, mensagem) VALUES (?, ?)').run(nome, mensagem);
  res.status(201).json({ id: result.lastInsertRowid, nome, mensagem });
});

app.post('/api/contato', (req, res) => {
  const { nome, email, mensagem } = req.body;
  if (!nome || !email || !mensagem) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }
  db.prepare('INSERT INTO contatos (nome, email, mensagem) VALUES (?, ?, ?)').run(nome, email, mensagem);
  res.status(201).json({ ok: true, mensagem: 'Mensagem enviada com sucesso!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', servico: 'crimson-echo-api' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Crimson Echo rodando na porta ${PORT}`);
});