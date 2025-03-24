import React, { useState, useEffect } from "react";
import { getCategories } from "./api";
import { PDFDownloadLink } from '@react-pdf/renderer';
import ChildReportPDF from './ChildReportPDF';
import { format } from 'date-fns';

function manualTextSplit(doc, text, maxWidth) {
    const words = text.split(' ');
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        const testWidth = doc.getStringUnitWidth(testLine) * doc.internal.scaleFactor;

        if (testWidth < maxWidth) {
            currentLine = testLine;
        } else {
            lines.push(currentLine);
            currentLine = words[i];
        }
    }
    lines.push(currentLine);
    return lines;
}

export default function EmployeePanel() {

    const [categories, setCategories] = useState([]);
    const [selectedAge, setSelectedAge] = useState("48 Monate");
    const ageOptions = ["48 Monate", "54 Monate", "60 Monate", "66 Monate", "72 Monate"];


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCategories(selectedAge);
                setCategories(data);
            } catch (error) {
                console.error("Fehler beim Laden der Kategorien:", error);
            }
        };
        fetchData();
    }, []);

    const handleRefresh = async () => {
        setRefreshStatus("refreshing");

        setTimeout(async () => {
            const data = await getCategories();
            setCategories(data);
            setRefreshStatus("updated");

            setTimeout(() => {
                setRefreshStatus("");
            }, 2000);
        }, 1500);
    };

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
        if (categories.length > 0 && !visitedCategories.includes(categories[currentCategory]?.id)) {
            setVisitedCategories(prev => [...prev, categories[currentCategory].id]);
        }
    }, [currentCategory, categories, visitedCategories]);

    useEffect(() => {
        const allVisited = categories.length > 0 && categories.every(category => visitedCategories.includes(category.id));
        setAllVisited(allVisited);
    }, [visitedCategories, categories]);

    const handleNextCategory = () => {
        if (currentCategory < categories.length - 1) {
            setCurrentCategory(currentCategory + 1);
        }
    };

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

    const getColor = (answer) => {
        return answer === "Ich weiß nicht" ? "#969696" :
            answer === "Kann es teilweise" ? "#FFA500" :
                answer === "Kann es" ? "#008000" : "#000000";
    };

    const [refreshStatus, setRefreshStatus] = useState("");

    return (
        <div id="wrapper">
            <div className="container">
                <h1>👩‍🏫 Mitarbeiter-Bereich</h1>
                <button className={`btn btn-blue ${refreshStatus}`} onClick={handleRefresh} disabled={refreshStatus !== ""}>
                    {refreshStatus === "refreshing" ? "🔄 Aktualisiert..." : refreshStatus === "updated" ? "✅ Aktualisiert" : "🔄 Aktualisieren"}
                </button>
                <div className="input-group">
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
                            onChange={async (e) => {
                                const age = e.target.value;
                                setChildData({ ...childData, age });
                                const data = await getCategories(age);
                                setCategories(data);
                                setCurrentCategory(0);
                                setVisitedCategories([]);
                            }}
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
                {childData.age && categories.length > 0 && (
                    <div className="category-container">
                        <h2>{categories[currentCategory].name}</h2>
                        <div className="question-holder">
                        {categories[currentCategory].questions.map((q) => (
                                <div key={q.id} className="question-block">
                                    <div className="question-holder">
                                        {q.tooltip && (
                                            <span className="tooltip-icon" data-tooltip={q.tooltip}> ℹ️</span>
                                        )}
                                        <p>{q.text}</p>

                                    </div>
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
                        </div>

                        <div className="button-group">
                            {currentCategory > 0 && <button className="btn btn-secondary" onClick={() => setCurrentCategory(currentCategory - 1)}>⬅ Zurück</button>}
                            {currentCategory < categories.length - 1 && <button className="btn btn-primary btn-next" onClick={handleNextCategory}>Weiter ➡</button>}
                        </div>
                    </div>
                )}

                {allVisited && (
                    <PDFDownloadLink
                        document={<ChildReportPDF childData={childData} categories={categories} />}
                        fileName={`${childData.name.replace(/\s+/g, '_') || 'Kind'}.pdf`}
                    >
                        {({ loading }) => (
                            <button className="btn btn-primary">
                                {loading ? 'PDF wird erstellt...' : '📄 PDF Herunterladen'}
                            </button>
                        )}
                    </PDFDownloadLink>
                )}
            </div>
        </div>
    );
}