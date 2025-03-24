const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydatabase.db');

db.serialize(() => {
    db.run('DROP TABLE IF EXISTS categories');
    db.run('DROP TABLE IF EXISTS questions');
    db.run('DROP TABLE IF EXISTS sqlite_sequence');

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
           tooltip TEXT,
           answer TEXT,
           comment TEXT,
           FOREIGN KEY (category_id) REFERENCES categories(id)
        )
  `);
});

db.close();