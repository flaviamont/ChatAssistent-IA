import { useEffect, useRef } from "react";
import styles from './GeminiAssistent.module.css';
import useGemini from '../../hooks/IA/useGemini';

export default function GeminiAssistent() {
  const { loading, messages, input, setInput, interpretarComando } = useGemini();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.container}>
      <h2>Interpretar Comando de Agenda</h2>

      <div className={styles.messagesContainer}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.role === "user" ? styles.userMessage : styles.assistantMessage}
          >
            <strong>{msg.role === "user" ? "Você:" : "Assistente:"}</strong> {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <textarea
        rows={4}
        cols={60}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite um comando para a agenda..."
      />
      <br />
      <div className={styles.btnAction}>
      <button onClick={interpretarComando} disabled={loading}>
        {loading ? "Processando..." : "Interpretar"}
      </button>
      </div>
    </div>
  );
}
