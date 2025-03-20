import React, { useState, useEffect } from "react";

export default function AdminPanel() {
    const loadCategories = () => {
        const savedCategories = localStorage.getItem("categories");
        return savedCategories ? JSON.parse(savedCategories) : [];
    };

    const [categories, setCategories] = useState(loadCategories());
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [admins, setAdmins] = useState([]);

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
        localStorage.setItem("categories", JSON.stringify(categories));
    }, [categories]);

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

    const handleAddCategory = () => {
        const newCategory = { id: Date.now(), name: "", questions: [] };
        setCategories([...categories, newCategory]);
    };

    const handleDeleteCategory = (categoryId) => {
        const updatedCategories = categories.filter(cat => cat.id !== categoryId);
        setCategories(updatedCategories);
    };

    const handleAddQuestion = (categoryId) => {
        const updatedCategories = categories.map(cat =>
            cat.id === categoryId
                ? { ...cat, questions: [...cat.questions, { id: Date.now(), text: "" }] }
                : cat
        );
        setCategories(updatedCategories);
    };

    const handleDeleteQuestion = (questionId, categoryId) => {
        const updatedCategories = categories.map(cat =>
            cat.id === categoryId
                ? { ...cat, questions: cat.questions.filter(q => q.id !== questionId) }
                : cat
        );
        setCategories(updatedCategories);
    };

    const handleSaveToJson = () => {
        const jsonData = JSON.stringify(categories, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "categories.json";
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleLoadFromJson = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const loadedCategories = JSON.parse(e.target.result);
                setCategories(loadedCategories);
            };
            reader.readAsText(file);
        }
    };

    if (!isAuthenticated) {
        return (
            <div id="wrapper">
                <div className="container">
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
                </div>
            </div>
        );
    }

    return (
        <div id="wrapper">
            <div className="container">
                <div className="admin-panel">
                    <h1>🛠 Admin Panel</h1>
                    <button className="btn btn-red" onClick={handleLogout}>
                        🔒 Abmelden
                    </button>

                    <button className="btn btn-green" onClick={handleSaveToJson}>
                        💾 Speichern als JSON
                    </button>

                    <label className="btn btn-blue btn-json">
                        📂 Laden aus JSON
                        <input
                            type="file"
                            accept=".json"
                            style={{ display: "none" }}
                            onChange={handleLoadFromJson}
                        />
                    </label>

                    <button className="btn btn-yellow" onClick={handleAddCategory}>
                        ➕ Kategorie hinzufügen
                    </button>

                    {categories.length === 0 && <p>⚠ Noch keine Kategorien erstellt</p>}

                    {categories.map((category) => (
                        <div key={category.id} className="category-container">
                            <input
                                className="category-title input-field"
                                placeholder="Kategorie Name"
                                value={category.name}
                                onChange={(e) => {
                                    const updatedCategories = categories.map(cat =>
                                        cat.id === category.id ? { ...cat, name: e.target.value } : cat
                                    );
                                    setCategories(updatedCategories);
                                }}
                            />

                            <button className="btn btn-blue" onClick={() => handleAddQuestion(category.id)}>
                                ➕ Frage hinzufügen
                            </button>
                            <button className="btn btn-red" onClick={() => handleDeleteCategory(category.id)}>
                                🗑️ Kategorie löschen
                            </button>

                            {category.questions.length > 0 && (
                                <div className="questions-container">
                                    {category.questions.map((q) => (
                                        <div key={q.id} className="question-block">
                                            <input
                                                className="input-field"
                                                placeholder="Frage eingeben"
                                                value={q.text}
                                                onChange={(e) => {
                                                    const updatedCategories = categories.map(cat =>
                                                        cat.id === category.id
                                                            ? {
                                                                ...cat,
                                                                questions: cat.questions.map(qItem =>
                                                                    qItem.id === q.id
                                                                        ? { ...qItem, text: e.target.value }
                                                                        : qItem
                                                                ),
                                                            }
                                                            : cat
                                                    );
                                                    setCategories(updatedCategories);
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
                    ))}
                </div>
            </div>
        </div>
    );
}