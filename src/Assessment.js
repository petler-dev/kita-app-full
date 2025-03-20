import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./index.css";

export default function Assessment() {
    const [userRole, setUserRole] = useState("");
    const [categories, setCategories] = useState([]);
    const [childData, setChildData] = useState({
        name: "",
        gender: "",
        birthYear: "",
        educator: "",
        group: "",
        age: ""
    });

    const [nameError, setNameError] = useState(false);

    const handleAddCategory = () => {

        if (!childData.name.trim()) {
            setNameError(true);
            return;
        }
        setNameError(false);
        setCategories([...categories, { category: "", questions: [] }]);
    };





    const handleReset = () => {
        setChildData({
            name: "",
            gender: "",
            birthYear: "",
            educator: "",
            group: "",
            age: ""
        });
        setCategories([]); // Очистка всех категорий и вопросов
        setNameError(false); // Сброс ошибки имени
    };



    // ✅ Добавление вопроса в категорию
    const handleAddQuestion = (catIndex) => {
        const updatedCategories = [...categories];
        updatedCategories[catIndex].questions.push({ text: "", info: "", answer: "" });
        setCategories(updatedCategories);
    };

    // ✅ Удаление категории
    const handleDeleteCategory = (catIndex) => {
        setCategories(categories.filter((_, index) => index !== catIndex));
    };

    // ✅ Удаление вопроса
    const handleDeleteQuestion = (catIndex, qIndex) => {
        const updatedCategories = [...categories];
        updatedCategories[catIndex].questions = updatedCategories[catIndex].questions.filter((_, index) => index !== qIndex);
        setCategories(updatedCategories);
    };

    // ✅ Выбор ответа (цветная кнопка)
    const handleAnswer = (catIndex, qIndex, value) => {
        const updatedCategories = [...categories];
        const question = updatedCategories[catIndex].questions[qIndex];

        if (question.answer === value) {
            // Если нажали на ту же кнопку — убираем ответ
            question.answer = "";
            question.selected = false;
        } else {
            // Устанавливаем новый ответ и вешаем selected
            question.answer = value;
            question.selected = true;
        }

        setCategories(updatedCategories);
    };


    const handleGeneratePDF = () => {
        const doc = new jsPDF();

        // Заголовок с именем ребёнка и датой
        const childName = childData.name.trim() !== "" ? childData.name : "Entwicklungsstand des Kindes";
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text(childName, 15, 20);

        const currentDate = new Date().toLocaleDateString("de-DE");
        doc.setFontSize(12);
        doc.text(currentDate, 180, 20, { align: "right" });

        let y = 40;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");

        const childDetails = [
            { label: "Geschlecht:", value: childData.gender },
            { label: "Geburtsjahr:", value: childData.birthYear },
            { label: "Erzieher:", value: childData.educator },
            { label: "Gruppe:", value: childData.group },
            { label: "Altersklasse:", value: childData.age }
        ];

        childDetails.forEach(detail => {
            doc.text(`${detail.label} ${detail.value || "-"}`, 15, y);
            y += 8; // Смещение вниз для нового элемента
        });

        y += 15; // Отступ после данных ребёнка

        categories.forEach((category, catIndex) => {
            if (!category?.category?.trim()) return;

            // Заголовок категории с отступом

            doc.setFillColor(230, 230, 230);
            doc.roundedRect(10, y, 190, 10, 2, 2, "F");
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text(category.category.toUpperCase(), 15, y + 7);
            y += 20;

            category.questions.forEach((q, qIndex) => {
                let color = [0, 0, 0];
                if (q.answer === "Ich weiß nicht") color = [150, 150, 150];
                if (q.answer === "Kann es teilweise") color = [255, 165, 0];
                if (q.answer === "Kann es") color = [0, 128, 0];

                // Вопрос с отступом
                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.text(`${qIndex + 1}. ${q.text}`, 15, y);

                // Ответ теперь по высоте вопроса!
                doc.setTextColor(...color);
                doc.setFontSize(12);
                doc.text(q.answer || "", 160, y, { align: "right" });
                doc.setTextColor(0, 0, 0);

                y += 6;

                // Комментарий
                if (q.info) {
                    doc.setFontSize(12);
                    doc.setFont("helvetica", "normal");
                    doc.text(`Kommentar: ${q.info}`, 15, y);
                    y += 6;
                }

                y += 10; // Отступ между вопросами
            });

            y += 10; // Отступ между категориями
        });

        doc.save(`${childName}.pdf`);
    };
    return (
        <div id="wrapper">
            <div className="container">
                <h1 className="title">🌈 Entwicklungsstand des Kindes 🌈</h1>

                {/* 📋 Информация о ребёнке */}
                <div className="form-group name-input">
                    <label>Name des Kindes</label>
                    <input
                        className={`input-field ${nameError ? "error-border" : ""}`} // Добавляем класс при ошибке
                        value={childData.name}
                        onChange={(e) => {
                            setChildData({ ...childData, name: e.target.value });
                            if (e.target.value.trim()) setNameError(false); // Сбрасываем ошибку при вводе
                        }}
                    />
                    {nameError && <p className="warning-text">Bitte geben Sie den Namen des Kindes ein.</p>}
                </div>

                <div className="form-group">
                    <label>Geschlecht</label>
                    <input
                        className="input-field"
                        value={childData.gender}
                        onChange={(e) => setChildData({ ...childData, gender: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Geburtsjahr</label>
                    <input
                        type="text"
                        className="input-field"
                        value={childData.birthYear}
                        onChange={(e) => setChildData({ ...childData, birthYear: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Name des Erziehers</label>
                    <input
                        className="input-field"
                        value={childData.educator}
                        onChange={(e) => setChildData({ ...childData, educator: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Gruppe</label>
                    <select
                        className="input-field"
                        value={childData.group}
                        onChange={(e) => setChildData({ ...childData, group: e.target.value })}
                    >
                        <option value="">Wählen...</option>
                        <option value="RegenTröpfchen">RegenTröpfchen</option>
                        <option value="Wölkchen">Wölkchen</option>
                        <option value="Gelbe Sonnenstrahlen">gelbe Sonnenstrahlen</option>
                        <option value="Orange Sonnenstrahlen">Orange Sonnenstrahlen</option>
                        <option value="Regenbogenrauschhüter">Regenbogenrauschhüter</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Altersklasse</label>
                    <select
                        className="input-field"
                        value={childData.age}
                        onChange={(e) => setChildData({ ...childData, age: e.target.value })}
                    >
                        <option value="">Alter wählen</option>
                        <option value="48 Monate">48 Monate</option>
                        <option value="54 Monate">54 Monate</option>
                        <option value="60 Monate">60 Monate</option>
                        <option value="66 Monate">66 Monate</option>
                        <option value="72 Monate">72 Monate</option>
                    </select>
                </div>

                {/* 🔧 Категории */}
                {categories.map((category, catIndex) => (
                    <div key={catIndex} className="category-container">
                        <input
                            className="category-title input-field"
                            placeholder="Kategorie Name"
                            value={category.category}
                            onChange={(e) => {
                                const updatedCategories = [...categories];
                                updatedCategories[catIndex].category = e.target.value;
                                setCategories(updatedCategories);
                            }}
                        />

                        <button className="btn btn-blue" onClick={() => handleAddQuestion(catIndex)}>➕ Frage hinzufügen</button>
                        <button className="btn btn-red" onClick={() => handleDeleteCategory(catIndex)}>🗑️ Kategorie löschen</button>

                        {category.questions.length > 0 && (
                            <div className="questions-container">
                                {category.questions.map((q, qIndex) => (
                                    <div key={qIndex} className="question-block">
                                        <button className="btn-close" onClick={() => handleDeleteQuestion(catIndex, qIndex)}>❌</button>
                                        <div className="button-group button-color">
                                            <button className={`btn btn-gray ${q.answer === "Ich weiß nicht" ? "selected" : ""}`} onClick={() => handleAnswer(catIndex, qIndex, "Ich weiß nicht")}>Ich weiß nicht</button>
                                            <button className={`btn btn-yellow ${q.answer === "Kann es teilweise" ? "selected" : ""}`} onClick={() => handleAnswer(catIndex, qIndex, "Kann es teilweise")}>Kann es teilweise</button>
                                            <button className={`btn btn-green ${q.answer === "Kann es" ? "selected" : ""}`} onClick={() => handleAnswer(catIndex, qIndex, "Kann es")}>Kann es</button>
                                        </div>

                                        <input className="input-field" placeholder="Frage eingeben" value={q.text} onChange={(e) => {
                                            const updatedCategories = [...categories];
                                            updatedCategories[catIndex].questions[qIndex].text = e.target.value;
                                            setCategories(updatedCategories);
                                        }} />

                                        <textarea className="input-textarea" placeholder="Beschreibung hinzufügen" value={q.info} onChange={(e) => {
                                            const updatedCategories = [...categories];
                                            updatedCategories[catIndex].questions[qIndex].info = e.target.value;
                                            setCategories(updatedCategories);
                                        }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {/* 🔽 Кнопки теперь всегда под последней категорией */}
                <div className="button-group">
                    <div className="button-category">
                        <button className="btn btn-yellow" onClick={handleAddCategory} >
                            ➕ Kategorie hinzufügen
                        </button>
                    </div>


                    <div className="buttons-container">

                        {categories.length > 0 && (
                            <button className="btn btn-primary" onClick={handleGeneratePDF}>
                                📄 PDF Generieren
                            </button>
                        )}
                    </div>
                    <button className="btn btn-red" onClick={handleReset}>🔄 Reset</button>
                </div>


            </div>
        </div>
    );
}