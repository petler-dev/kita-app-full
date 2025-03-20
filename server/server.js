const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.json());

// Подключение к SQLite (файл mydatabase.db)
const db = new sqlite3.Database('./mydatabase.db');

// Создание таблиц (если их нет)
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      text TEXT NOT NULL,
      answer TEXT,
      comment TEXT,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);
});

// Получить все категории
app.get('/categories', (req, res) => {
    db.all('SELECT * FROM categories', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Добавить категорию
app.post('/categories', (req, res) => {
    const { name } = req.body;
    db.run('INSERT INTO categories (name) VALUES (?)', [name], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});