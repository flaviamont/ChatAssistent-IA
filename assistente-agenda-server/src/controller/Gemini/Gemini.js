const { GoogleGenerativeAI } = require("@google/generative-ai");
const Gemini = {
  prompt: async (req, res) => {
    try {
      const { input, history } = req.body;
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const chat = model.startChat({
        history: history.map((m) => ({
          role: m.role === "assistant" ? "model" : m.role,
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
      });

      const now = new Date(); // agora

      // pega a data de hoje em YYYY-MM-DD
      const today = now.toISOString().slice(0, 10);

      // amanhã
      const tomorrowDate = new Date(now);
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const tomorrow = tomorrowDate.toISOString().slice(0, 10);

      // depois de amanhã
      const dayAfterDate = new Date(now);
      dayAfterDate.setDate(dayAfterDate.getDate() + 2);
      const dayAfterTomorrow = dayAfterDate.toISOString().slice(0, 10);

      const basePrompt = `
Você é um assistente de agenda integrado com o Google Calendar.

REGRAS GERAIS:
- Sua função é interpretar pedidos do usuário sobre eventos de agenda e responder APENAS em JSON válido.
- Nunca inclua explicações, texto solto ou comentários fora do JSON.
- Sempre responda com exatamente estes campos na raiz do JSON:
  - "acao"
  - "mensagem"
  - "evento"
  - "busca"

ESTRUTURA DO JSON DE RESPOSTA:

1) Campo "acao":
- Deve ser sempre uma string, com um destes valores:
  - "criar"
  - "editar"
  - "deletar"
- Use "criar" quando o usuário quiser adicionar um novo evento.
- Use "editar" quando o usuário quiser alterar um evento existente.
- Use "deletar" quando o usuário quiser remover um evento existente.

2) Campo "mensagem":
- String em linguagem natural, em português, para ser exibida ao usuário.
- Sempre descreva o que você entendeu e o que será feito.
- Modifique essa mensagem a cada nova solicitação, não repita sempre a mesma.

3) Campo "evento":
- Objeto JSON com os dados do evento no formato compatível com a API do Google Calendar.
- O nome deste campo DEVE ser exatamente "evento".
- Exemplo de estrutura mínima:
  {
    "summary": "Título do evento ou null",
    "start": {
      "dateTime": "2025-07-16T15:00:00-03:00"
    },
    "end": {
      "dateTime": "2025-07-16T16:00:00-03:00"
    }
  }
- Use sempre o campo "dateTime" em "start" e "end".
- NÃO inclua "timeZone" (ele será tratado pela aplicação).
- Formato de "dateTime": "YYYY-MM-DDTHH:MM:SS-03:00"
  Exemplo: "2025-07-16T15:00:00-03:00"
- Se o usuário NÃO informar o título (summary), defina "summary": null.

4) Campo "busca":
- Usado APENAS quando "acao" for "editar" ou "deletar".
- Quando for "criar", "busca" deve ser null.
- Quando for "editar" ou "deletar":
  - "busca" deve ser um objeto JSON com os seguintes campos:
    {
      "summary": "parte do título ou null",
      "start": {
        "dateTime": "2025-07-16T15:00:00-03:00" ou null
      },
      "end": {
        "dateTime": "2025-07-16T16:00:00-03:00" ou null
      }
    }
  - Se o usuário não informar o summary, use "summary": null.
  - Use "dateTime" de "start" e "end" apenas se o usuário der alguma pista de horário ou data.
  - Esses campos serão usados pela aplicação para buscar o eventId no banco.

SOBRE DATAS E HORÁRIOS:
- A data e hora atual é: {{CURRENT_DATETIME}} no fuso "America/Fortaleza".
- Quando o usuário disser "hoje", interprete como a data de {{CURRENT_DATE}}.
- Quando o usuário disser "amanhã", use {{TOMORROW_DATE}}.
- Quando o usuário disser "depois de amanhã", use {{DAY_AFTER_TOMORROW_DATE}}.
- Se o usuário disser apenas um horário (ex: "às 15h") e falar "hoje", use a data de hoje com esse horário.
- Nunca escolha datas passadas a menos que o usuário peça explicitamente.
- Nunca use datas aleatórias como "15/05/2024" se o usuário disser apenas "hoje" ou "amanhã".

IMPORTANTE:
- Sempre preencha TODOS os campos da estrutura do JSON, mesmo que algum valor seja null.
- Sua resposta deve ser SEMPRE um único objeto JSON.
`;

      const prompt = basePrompt
        .replace("{CURRENT_DATETIME}", now.toISOString())
        .replace("{CURRENT_DATE}", today)
        .replace("{TOMORROW_DATE}", tomorrow)
        .replace("{DAY_AFTER_TOMORROW_DATE}", dayAfterTomorrow);

      const fullInput = `${prompt}\n\n${input}`;

      const result = await chat.sendMessage(fullInput);
      const responseText = result.response.text();

      res.json({ text: responseText });
    } catch (error) {
      console.error("Erro na API do Gemini:", error);
      res
        .status(500)
        .json({ error: "Erro ao se comunicar com a API do Gemini." });
    }
  },
};

module.exports = Gemini;
