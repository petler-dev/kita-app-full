import React, { useState, useEffect } from "react";
import {
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    addQuestion,
    deleteQuestion,
    updateQuestion
} from "./api";

export default function AdminPanel() {
    const [categories, setCategories] = useState([]);
    const ageOptions = ["48 Monate", "54 Monate", "60 Monate", "66 Monate", "72 Monate"];
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [admins, setAdmins] = useState([]);
    const [openAges, setOpenAges] = useState([]);

    useEffect(() => {
        fetch("/admins.json")
            .then((response) => response.json())
            .then((data) => setAdmins(data))
            .catch((error) => console.error("Fehler beim Laden der Admins:", error));
    }, []);

    useEffect(() => {
        const savedAuth = localStorage.getItem("isAuthenticated");
        if (savedAuth === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            const fetchCategories = async () => {
                const data = await getCategories();
                setCategories(data);
            };
            fetchCategories();
        }
    }, [isAuthenticated]);

    const handleLogin = () => {
        const admin = admins.find(
            (admin) => admin.username === username && admin.password === password
        );

        if (admin) {
            setIsAuthenticated(true);
            localStorage.setItem("isAuthenticated", "true");
        } else {
            alert("Falscher Benutzername oder Passwort.");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
    };

    const handleAddCategory = async (age) => {
        const newCategory = await addCategory("", age);
        setCategories([...categories, { ...newCategory, name: "", age, questions: [] }]);
    };

    const toggleAge = (age) => {
        setOpenAges((prev) =>
            prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age]
        );
    };

    const handleDeleteCategory = async (categoryId) => {
        await deleteCategory(categoryId);
        setCategories(categories.filter(cat => cat.id !== categoryId));
    };

    const handleAddQuestion = async (categoryId) => {
        const newQuestion = await addQuestion(categoryId, "");
        const updatedCategories = categories.map(cat =>
            cat.id === categoryId
                ? { ...cat, questions: [...(cat.questions || []), newQuestion]}
                : cat
        );
        setCategories(updatedCategories);
    };

    const handleDeleteQuestion = async (questionId, categoryId) => {
        await deleteQuestion(categoryId, questionId);
        const updatedCategories = categories.map(cat =>
            cat.id === categoryId
                ? { ...cat, questions: cat.questions.filter(q => q.id !== questionId) }
                : cat
        );
        setCategories(updatedCategories);
    };

    const handleSyncToLocalStorage = () => {
        setSavingStatus("saving");

        setTimeout(() => {
            localStorage.setItem("categories", JSON.stringify(categories));
            setSavingStatus("saved");

            setTimeout(() => {
                setSavingStatus("");
            }, 2000);
        }, 1500);
    };


    const [savingStatus, setSavingStatus] = useState("");

    if (!isAuthenticated) {
        return (
            <div id="wrapper">
                <div className="container">
                    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                        <div className="login-form">
                            <h1>🔒 Admin Login</h1>
                            <div className="form-group">
                                <label>Benutzername</label>
                                <input
                                    className="input-field"
                                    type="text"
                                    placeholder="Benutzername"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Passwort</label>
                                <input
                                    className="input-field"
                                    type="password"
                                    placeholder="Passwort"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button className="btn btn-primary" onClick={handleLogin}>
                                Einloggen
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div id="wrapper" className="admin-panel">
            <div className="container">
                <div className="admin-panel">
                    <h1>🛠 Admin Panel</h1>
                    <button className="btn btn-red" onClick={handleLogout}>
                        🔒 Abmelden
                    </button>
                    <button className={`btn btn-green ${savingStatus}`} onClick={handleSyncToLocalStorage} disabled={savingStatus !== ""}>
                        {savingStatus === "saving" ? "💾 Speichert..." : savingStatus === "saved" ? "✅ Gespeichert" : "💾 Für Mitarbeiter speichern"}
                    </button>

                    {categories.length === 0 && <p>⚠ Noch keine Kategorien erstellt</p>}
                    {ageOptions.map((age) => {
                        const isOpen = openAges.includes(age);
                        return (
                            <div key={age} className={`age-group ${isOpen ? "open" : ""}`}>
                                <h2 onClick={() => toggleAge(age)}>
                                    🧒 Altersklasse: {age}
                                </h2>
                                {isOpen && (
                                    <div className="age-content">
                                        <button className="btn btn-yellow" onClick={() => handleAddCategory(age)}>
                                            ➕ Kategorie für {age} hinzufügen
                                        </button>
                                        {categories.filter(cat => cat.age === age).length === 0 && (
                                            <p>⚠ Noch keine Kategorien für dieses Alter</p>
                                        )}
                                        {categories
                                            .filter(cat => cat.age === age)
                                            .map((category) => (
                                                <React.Fragment key={category.id}>
                                                    <div className="category-container">
                                                        <input
                                                            className="category-title input-field"
                                                            placeholder="Kategorie Name"
                                                            value={category.name}
                                                            onChange={(e) => {
                                                                const updatedCategories = categories.map(cat =>
                                                                    cat.id === category.id ? { ...cat, name: e.target.value } : cat
                                                                );
                                                                setCategories(updatedCategories);
                                                                updateCategory(category.id, e.target.value);
                                                            }}
                                                        />
                                                        <button className="btn btn-blue" onClick={() => handleAddQuestion(category.id)}>
                                                            ➕ Frage hinzufügen
                                                        </button>
                                                        <button className="btn btn-red" onClick={() => handleDeleteCategory(category.id)}>
                                                            🗑️ Kategorie löschen
                                                        </button>

                                                        {category.questions?.length > 0 && (
                                                            <div className="questions-container">
                                                                {category.questions.map((q) => (
                                                                    <div key={q.id} className="question-block">
                                                                        <input
                                                                            className="input-field question-field"
                                                                            placeholder="Frage eingeben"
                                                                            value={q.text || ""}
                                                                            onChange={(e) => {
                                                                                const updatedCategories = categories.map(cat =>
                                                                                    cat.id === category.id
                                                                                        ? {
                                                                                            ...cat,
                                                                                            questions: cat.questions.map(qItem =>
                                                                                                qItem.id === q.id
                                                                                                    ? { ...qItem, text: e.target.value }
                                                                                                    : qItem
                                                                                            )
                                                                                        }
                                                                                        : cat
                                                                                );
                                                                                setCategories(updatedCategories);
                                                                                updateQuestion(category.id, q.id, e.target.value, q.tooltip);
                                                                            }}
                                                                        />
                                                                        <textarea
                                                                            className="input-field"
                                                                            placeholder="Tooltip eingeben"
                                                                            value={q.tooltip || ""}
                                                                            onInput={(e) => {
                                                                                e.target.style.height = "auto";
                                                                                e.target.style.height = `${e.target.scrollHeight}px`;
                                                                            }}
                                                                            onChange={(e) => {
                                                                                const updatedCategories = categories.map(cat =>
                                                                                    cat.id === category.id
                                                                                        ? {
                                                                                            ...cat,
                                                                                            questions: cat.questions.map(qItem =>
                                                                                                qItem.id === q.id
                                                                                                    ? { ...qItem, tooltip: e.target.value }
                                                                                                    : qItem
                                                                                            )
                                                                                        }
                                                                                        : cat
                                                                                );
                                                                                setCategories(updatedCategories);
                                                                                updateQuestion(category.id, q.id, q.text, e.target.value);
                                                                            }}
                                                                      />

                                                                        <button className="btn btn-red" onClick={() => handleDeleteQuestion(q.id, category.id)}>
                                                                            ❌ Frage löschen
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </React.Fragment>
                                            ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}