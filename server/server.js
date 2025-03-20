const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к базе данных
const db = mysql.createConnection({
    host: "localhost",
    user: "root",  // Замени на свой логин
    password: "",  // Если у тебя есть пароль — введи его здесь
    database: "kita_db",
});

db.connect((err) => {
    if (err) {
        console.error("Ошибка подключения к БД:", err);
        return;
    }
    console.log("Подключено к MySQL!");
});

// **🔹 Запрос на получение всех категорий и вопросов**
app.get("/api/categories", (req, res) => {
    const sql = `
        SELECT categories.id AS categoryId, categories.name AS category, questions.id AS questionId, 
               questions.text, questions.answer, questions.comment 
        FROM categories 
        LEFT JOIN questions ON categories.id = questions.category_id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Ошибка загрузки категорий:", err);
            res.status(500).json({ error: "Ошибка сервера" });
            return;
        }

        // Преобразуем массив в удобный JSON-формат
        const categories = {};
        results.forEach((row) => {
            if (!categories[row.categoryId]) {
                categories[row.categoryId] = {
                    id: row.categoryId,
                    category: row.category,
                    questions: [],
                };
            }

            if (row.questionId) {
                categories[row.categoryId].questions.push({
                    id: row.questionId,
                    text: row.text,
                    answer: row.answer,
                    comment: row.comment,
                });
            }
        });

        res.json(Object.values(categories));
    });
});

// **🔹 Запрос для сохранения ответа**
app.post("/api/save-answer", (req, res) => {
    const { questionId, answer } = req.body;

    const sql = "UPDATE questions SET answer = ? WHERE id = ?";
    db.query(sql, [answer, questionId], (err, result) => {
        if (err) {
            console.error("Ошибка сохранения ответа:", err);
            res.status(500).json({ error: "Ошибка сервера" });
            return;
        }
        res.json({ message: "Ответ сохранен" });
    });
});

// **🔹 Запрос для сохранения комментария**
app.post("/api/save-comment", (req, res) => {
    const { questionId, comment } = req.body;

    const sql = "UPDATE questions SET comment = ? WHERE id = ?";
    db.query(sql, [comment, questionId], (err, result) => {
        if (err) {
            console.error("Ошибка сохранения комментария:", err);
            res.status(500).json({ error: "Ошибка сервера" });
            return;
        }
        res.json({ message: "Комментарий сохранен" });
    });
});

// Запуск сервера
app.listen(5000, () => {
    console.log("Сервер запущен на http://localhost:5000");
});
