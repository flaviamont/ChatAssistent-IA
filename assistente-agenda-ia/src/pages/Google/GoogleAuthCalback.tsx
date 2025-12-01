// src/pages/GoogleCallback.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function GoogleAuthCallback() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token);
            console.log("Token salvo com sucesso!");
            navigate("/home", { replace: true });
        } else {
            console.log("Token não encontrado na URL.");
            navigate("/");
        }
    }, [location, navigate]);

    return <p>Autenticando com o Google...</p>;
}
