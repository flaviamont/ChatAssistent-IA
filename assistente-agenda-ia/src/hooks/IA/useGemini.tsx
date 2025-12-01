import axios from "axios";
import { useState } from "react";
import useCalendarEvent from "../Google/Calendar/useCalendarEvent";
import useCalendarEventUpdate from "../Google/Calendar/useCalendarEventUpdate";
import useCalendarEventFind from "../Google/Calendar/useCalendarEventFind";
import useCalendarEventDelete from "../Google/Calendar/useCalendarEventDelete";
import { api } from "../../api/api";

export default function useGemini() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  type Message = {
    role: "user" | "assistant";
    content: string;
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const { createdEvent } = useCalendarEvent();
  const { updateEvent } = useCalendarEventUpdate();
  const { deleteEvent } = useCalendarEventDelete();
  const { findEventID, eventId } = useCalendarEventFind();

  async function interpretarComando() {
    if (!input.trim()) return;
    setLoading(true);

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await api.post("/gemini", {
        input: input,
        history: messages,
      });

      const respostaIA = response.data.text;

      if (!respostaIA) {
        console.error("Resposta da IA está vazia!");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Desculpe, não consegui interpretar o seu pedido. Por favor, tente reformular.",
          },
        ]);
        setLoading(false);
        return;
      }

      console.log("a resposta do Gemini: ", respostaIA);

      let jsonString = respostaIA.replace(/```json|```/g, "").trim();

      const match = jsonString.match(/\{[\s\S]*\}/);
      if (!match) {
        console.error("Não foi possível extrair JSON válido da resposta.");
        return;
      }

      let parsed;
      try {
        parsed = JSON.parse(match[0]);
      } catch (e) {
        console.error("Erro ao converter JSON da IA:", e);
        return;
      }

      const mensagemIA = parsed.mensagem;
      const evento = parsed.evento;
      const acao = parsed.acao;
      const busca = parsed.busca;

      if (busca != null) {
        await findEventID(busca);
      }

      console.log("evento id", eventId);
      switch (acao) {
        case "criar":
          createdEvent(evento);
          break;
        case "editar":
          updateEvent(eventId, evento);
          break;
        case "deletar":
          deleteEvent(eventId);
          break;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: mensagemIA },
      ]);
    } catch (error) {
      console.error("Erro ao interpretar comando:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.",
        },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  }

  return {
    messages,
    setMessages,
    loading,
    input,
    setInput,
    interpretarComando,
  };
}
