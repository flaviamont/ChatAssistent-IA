# Assistente de Google Calendar com IA

Aplicação fullstack que integra uma IA com o Google Calendar para criar, editar e deletar eventos a partir de comandos em linguagem natural.

O usuário fala/escreve algo como:

> "Marca uma reunião amanhã às 15h"

E a aplicação:

1. Envia esse comando para a IA (Gemini).
2. A IA interpreta o pedido e responde em JSON com a ação e os dados do evento.
3. O backend trata esse JSON, interage com a API do Google Calendar e sincroniza os eventos.
4. O frontend exibe o resultado de forma amigável.

---

## ✨ Funcionalidades

- Criar eventos no Google Calendar usando texto livre.
- Editar eventos já existentes (com base em título e/ou data/hora).
- Deletar eventos usando linguagem natural.
- Suporte a datas relativas:
  - “hoje”
  - “amanhã”
  - “depois de amanhã”
- Sincronização com Google Calendar via API oficial.
- Armazenamento de informações importantes (como `eventId`) em MongoDB para facilitar edições/deleções futuras.
- Interface em React + TypeScript para interação com o usuário.

---

## 🧠 Arquitetura resumida

- **Frontend**: React + TypeScript  
  - Interface para o usuário digitar comandos e visualizar o resultado.
  - Consome uma API REST do backend.

- **Backend**: Node.js + Express
  - Exposição de endpoints REST.
  - Integração com:
    - API do Google Calendar.
    - IA (Gemini).
    - Banco de dados MongoDB.
  - Responsável por interpretar a resposta da IA e realizar as ações no Calendar.

- **Banco de Dados**: MongoDB  
  - Armazena:
    - `eventId` do Google Calendar.
    - Dados relevantes do evento (título, horários, etc.).
    - Informações necessárias para localizar o evento em futuras edições/deleções.

- **IA**: Gemini  
  - Recebe o texto da usuária.
  - Devolve um JSON estruturado com:
    - `acao` (`criar`, `editar`, `deletar`)
    - `mensagem`
    - `evento`
    - `busca`

---

## 🧩 Contrato com a IA

A IA é instruída via prompt para responder com o seguinte formato:

```json
{
  "acao": "criar | editar | deletar",
  "mensagem": "Texto em português explicando o que será feito",
  "evento": {
    "summary": "Título do evento ou null",
    "start": {
      "dateTime": "2025-07-16T15:00:00-03:00"
    },
    "end": {
      "dateTime": "2025-07-16T16:00:00-03:00"
    }
  },
  "busca": null
}
