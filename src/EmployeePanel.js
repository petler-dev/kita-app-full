import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";

export default function EmployeePanel() {
    const loadCategories = () => {
        const savedCategories = localStorage.getItem("categories");
        return savedCategories ? JSON.parse(savedCategories) : [];
    };

    const [categories, setCategories] = useState(loadCategories());
    const [currentCategory, setCurrentCategory] = useState(0);
    const [childData, setChildData] = useState({
        name: "",
        gender: "",
        birthYear: "",
        group: "",
        age: "",
        educator: "",
    });
    const [visitedCategories, setVisitedCategories] = useState([]);
    const [allVisited, setAllVisited] = useState(false);

    useEffect(() => {
        setCategories(loadCategories());
    }, []);

    // ✅ Добавляем текущую категорию в visitedCategories при изменении currentCategory
    useEffect(() => {
        if (categories.length > 0 && !visitedCategories.includes(categories[currentCategory]?.id)) {
            setVisitedCategories(prev => [...prev, categories[currentCategory].id]);
        }
    }, [currentCategory, categories, visitedCategories]);

    // ✅ Проверяем, все ли категории посещены
    useEffect(() => {
        const allVisited = categories.length > 0 && categories.every(category => visitedCategories.includes(category.id));
        setAllVisited(allVisited);
        console.log("Все категории посещены?", allVisited);
        console.log("Посещённые категории:", visitedCategories);
        console.log("Все категории:", categories);
    }, [visitedCategories, categories]);

    // ✅ Обработка перехода к следующей категории
    const handleNextCategory = () => {
        if (currentCategory < categories.length - 1) {
            setCurrentCategory(currentCategory + 1);
        }
    };

    // ✅ Обработка ответа на вопрос
    const handleAnswer = (categoryId, questionId, value) => {
        const updatedCategories = categories.map(cat =>
            cat.id === categoryId
                ? {
                    ...cat,
                    questions: cat.questions.map(q =>
                        q.id === questionId ? { ...q, answer: value } : q
                    ),
                }
                : cat
        );
        setCategories(updatedCategories);
        localStorage.setItem("categories", JSON.stringify(updatedCategories));
    };

    // ✅ Обработка комментария
    const handleCommentChange = (categoryId, questionId, value) => {
        const updatedCategories = categories.map(cat =>
            cat.id === categoryId
                ? {
                    ...cat,
                    questions: cat.questions.map(q =>
                        q.id === questionId ? { ...q, comment: value } : q
                    ),
                }
                : cat
        );
        setCategories(updatedCategories);
        localStorage.setItem("categories", JSON.stringify(updatedCategories));
    };

    // ✅ Генерация PDF
    const handleGeneratePDF = () => {
        const doc = new jsPDF();

        const childName = childData?.name?.trim() ? childData.name : "Entwicklungsstand des Kindes";
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
            { label: "Geschlecht:", value: childData?.gender || "-" },
            { label: "Geburtsjahr:", value: childData?.birthYear || "-" },
            { label: "Erzieher:", value: childData?.educator || "-" },
            { label: "Gruppe:", value: childData?.group || "-" },
            { label: "Altersklasse:", value: childData?.age || "-" }
        ];

        childDetails.forEach(detail => {
            doc.text(`${detail.label} ${detail.value}`, 15, y);
            y += 8;
        });

        y += 15;

        categories.forEach((category, catIndex) => {
            if (!category?.name?.trim()) return;

            doc.setFillColor(230, 230, 230);
            doc.roundedRect(10, y, 190, 10, 2, 2, "F");
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text(category.name.toUpperCase(), 15, y + 7);
            y += 20;

            (category.questions || []).forEach((q, qIndex) => {
                let color = [0, 0, 0];

                if (q.answer === "Ich weiß nicht") color = [150, 150, 150];
                if (q.answer === "Kann es teilweise") color = [255, 165, 0];
                if (q.answer === "Kann es") color = [0, 128, 0];

                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.text(`${qIndex + 1}. ${q?.text || "-"}`, 15, y);

                doc.setTextColor(...color);
                doc.text(q?.answer || "-", 180, y, { align: "right" });
                doc.setTextColor(0, 0, 0);

                y += 6;

                if (q?.comment?.trim()) {
                    doc.setFontSize(12);
                    doc.setFont("helvetica", "normal");
                    doc.text(`Kommentar: ${q.comment}`, 15, y);
                    y += 6;
                }

                y += 10;
            });

            y += 10;
        });

        doc.save(`${childName}.pdf`);
    };

    return (
        <div id="wrapper">
            <div className="container">
                <h1>👩‍🏫 Mitarbeiter-Bereich</h1>

                <div className="input-group">
                    {/* 📋 Данные ребёнка */}
                    <div className="form-group">
                        <label>Name des Kindes</label>
                        <input
                            className="input-field"
                            value={childData.name || ""}
                            onChange={(e) => setChildData({ ...childData, name: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Geschlecht</label>
                        <select
                            className="input-field"
                            value={childData.gender || ""}
                            onChange={(e) => setChildData({ ...childData, gender: e.target.value })}
                        >
                            <option value="">Wählen...</option>
                            <option value="Mädchen">Mädchen</option>
                            <option value="Junge">Junge</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Geburtsjahr</label>
                        <input
                            type="text"
                            className="input-field"
                            value={childData.birthYear || ""}
                            onChange={(e) => setChildData({ ...childData, birthYear: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Name des Erziehers</label>
                        <input
                            className="input-field"
                            value={childData.educator || ""}
                            onChange={(e) => setChildData({ ...childData, educator: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Gruppe</label>
                        <select
                            className="input-field"
                            value={childData.group || ""}
                            onChange={(e) => setChildData({ ...childData, group: e.target.value })}
                        >
                            <option value="">Wählen...</option>
                            <option value="RegenTröpfchen">RegenTröpfchen</option>
                            <option value="Wölkchen">Wölkchen</option>
                            <option value="Gelbe Sonnenstrahlen">Gelbe Sonnenstrahlen</option>
                            <option value="Orange Sonnenstrahlen">Orange Sonnenstrahlen</option>
                            <option value="Regenbogenrauschhüter">Regenbogenrauschhüter</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Altersklasse</label>
                        <select
                            className="input-field"
                            value={childData.age || ""}
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
                </div>

                {/* 🔽 Категории и вопросы */}
                {categories.length > 0 && (
                    <div className="category-container">
                        <h2>{categories[currentCategory].name}</h2>

                        {categories[currentCategory].questions.map((q) => (
                            <div key={q.id} className="question-block">
                                <p>{q.text}</p>
                                <div className="button-group button-color">
                                    <button className={`btn btn-gray ${q.answer === "Ich weiß nicht" ? "selected" : ""}`} onClick={() => handleAnswer(categories[currentCategory].id, q.id, "Ich weiß nicht")}>Ich weiß nicht</button>
                                    <button className={`btn btn-yellow ${q.answer === "Kann es teilweise" ? "selected" : ""}`} onClick={() => handleAnswer(categories[currentCategory].id, q.id, "Kann es teilweise")}>Kann es teilweise</button>
                                    <button className={`btn btn-green ${q.answer === "Kann es" ? "selected" : ""}`} onClick={() => handleAnswer(categories[currentCategory].id, q.id, "Kann es")}>Kann es</button>
                                </div>
                                <textarea
                                    className="input-textarea"
                                    placeholder="Kommentar hinzufügen"
                                    value={q.comment || ""}
                                    onChange={(e) => handleCommentChange(categories[currentCategory].id, q.id, e.target.value)}
                                />
                            </div>
                        ))}

                        <div className="button-group">
                            {currentCategory > 0 && <button className="btn btn-secondary" onClick={() => setCurrentCategory(currentCategory - 1)}>⬅ Zurück</button>}
                            {currentCategory < categories.length - 1 && <button className="btn btn-primary" onClick={handleNextCategory}>Weiter ➡</button>}
                        </div>
                    </div>
                )}

                {/* Кнопка генерации PDF */}
                {allVisited && (
                    <button className="btn btn-primary" onClick={handleGeneratePDF}>📄 PDF Generieren</button>
                )}
            </div>
        </div>
    );
}