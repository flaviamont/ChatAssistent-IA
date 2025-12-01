import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GeminiAssistent from "../../components/Chatbot/GeminiAssistent";

export default function Home() {
    return (
        <div className="container-home">
            <GeminiAssistent />
        </div>
    )
}