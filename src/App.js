import React, { useState } from "react";
import AdminPanel from "./AdminPanel";
import EmployeePanel from "./EmployeePanel";

export default function App() {
    const [categories, setCategories] = useState([]);
    const [userRole, setUserRole] = useState("");

    return (
        <div>
            {!userRole && (
                <div className="role-selection">
                    <h2>Wählen Sie Ihre Rolle:</h2>
                    <button className="btn btn-blue" onClick={() => setUserRole("admin")}>Admin</button>
                    <button className="btn btn-green" onClick={() => setUserRole("employee")}>Mitarbeiter</button>
                </div>
            )}

            {userRole === "admin" && <AdminPanel categories={categories} setCategories={setCategories} />}
            {userRole === "employee" && <EmployeePanel categories={categories} setCategories={setCategories} />}
        </div>
    );
}
