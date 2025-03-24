const sqlite3 = require('sqlite3').verbose();

// Подключение к базе данных (файл mydatabase.db)
const db = new sqlite3.Database('./mydatabase.db');

// Удаление старых таблиц (если они есть)
db.serialize(() => {
    db.run('DROP TABLE IF EXISTS categories');
    db.run('DROP TABLE IF EXISTS questions');
    db.run('DROP TABLE IF EXISTS sqlite_sequence');

    // Создание новых таблиц
    db.run(`
    CREATE TABLE categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age TEXT NOT NULL
    )
  `);

    db.run(`
    CREATE TABLE questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      text TEXT NOT NULL,
      answer TEXT,
      comment TEXT,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);


    // Вставка тестовых данных (опционально)
    db.run('INSERT INTO categories (name, age) VALUES (?, ?)', ['Категория 1', '48 Monate']);
    db.run('INSERT INTO categories (name, age) VALUES (?, ?)', ['Категория 2', '54 Monate']);

    db.run(`
    INSERT INTO questions (category_id, text, answer, comment)
    VALUES (?, ?, ?, ?)
  `, [1, 'Вопрос 1', 'Ответ 1', 'Комментарий 1']);

    db.run(`
    INSERT INTO questions (category_id, text, answer, comment)
    VALUES (?, ?, ?, ?)
  `, [1, 'Вопрос 2', 'Ответ 2', 'Комментарий 2']);

    console.log('База данных успешно инициализирована!');
});

// Закрытие соединения с базой данных
db.close();