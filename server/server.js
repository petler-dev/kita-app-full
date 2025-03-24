const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const cors = require('cors');
app.use(cors({
    origin: "*",
    methods:
    "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials:true,
    allowedHeaders:
    "Content-Type,Authorization"
}));
app.use(express.json());

const db = new sqlite3.Database('./mydatabase.db');


db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age TEXT NOT NULL
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

app.get('/categories', (req, res) => {
    db.all('SELECT * FROM categories', (err, categories) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const filterAge = req.query.age;
        const filteredCategories = filterAge
            ? categories.filter(cat => cat.age === filterAge)
            : categories;

        db.all('SELECT * FROM questions', (err, questions) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const categoriesWithQuestions = filteredCategories.map(category => {
                const categoryQuestions = questions
                    .filter(q => q.category_id === category.id)
                    .map(q => ({
                        id: q.id,
                        text: q.text,
                        tooltip: q.tooltip || "",
                        answer: q.answer,
                        comment: q.comment
                    }));

                return {
                    ...category,
                    questions: categoryQuestions
                };
            });


            res.json(categoriesWithQuestions);
        });
    });
});


app.post('/categories/:categoryId/questions', (req, res) => {
    const { categoryId } = req.params;
    const { text, tooltip } = req.body;
    db.run(
        'INSERT INTO questions (category_id, text, tooltip) VALUES (?, ?, ?)',
        [categoryId, text],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID, text, answer: null, comment: null });
        }
    );
});

app.delete('/categories/:categoryId/questions/:questionId', (req, res) => {
    const { questionId } = req.params;

    db.run('DELETE FROM questions WHERE id = ?', [questionId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true });
    });
});

app.delete('/categories/:id', (req, res) => {
    const { id } = req.params;

    db.serialize(() => {
        db.run('DELETE FROM questions WHERE category_id = ?', [id]);
        db.run('DELETE FROM categories WHERE id = ?', [id], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true });
        });
    });
});

app.put('/categories/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    db.run('UPDATE categories SET name = ? WHERE id = ?', [name, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true });
    });
});

app.post('/categories', (req, res) => {
    const { name, age } = req.body;
    db.run('INSERT INTO categories (name, age) VALUES (?, ?)', [name, age], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

app.put('/categories/:categoryId/questions/:questionId', (req, res) => {
    const { questionId } = req.params;
    const { text, tooltip } = req.body;
    db.run(
        'UPDATE questions SET text = ?, tooltip = ? WHERE id = ?',
        [text, tooltip, questionId],
        [text, questionId],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true });
        }
    );
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server run on http://localhost:${PORT}`);
});