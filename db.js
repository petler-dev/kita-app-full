const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",  // Если Laragon запущен, localhost должен работать
    user: "root",       // Стандартный пользователь в Laragon
    password: "",       // В Laragon по умолчанию пустой пароль
    database: "kita_db" // Название твоей базы данных
});

db.connect((err) => {
    if (err) {
        console.error("Ошибка подключения к БД:", err);
        return;
    }
    console.log("✅ Подключение к базе данных успешно!");
});

module.exports = db;
