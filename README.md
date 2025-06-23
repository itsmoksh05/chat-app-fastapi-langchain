# 🤖 Groq LangChain Chat App

🎓 **Learning Project** – A full-stack AI chatbot built with ⚡ **FastAPI**, 🔗 **LangChain**, and 🤖 **Groq's LLaMA model** on the backend, paired with a simple 🌐 **vanilla HTML, CSS, and JavaScript** frontend.

---

## 📌 Overview

This project showcases my hands-on learning in building a conversational AI system. It combines a powerful LLM backend using **Groq + LLaMA** and **LangChain** with a responsive **vanilla frontend** to simulate real-time chat functionality.

---

## 🚀 Features

- 🧠 Chatbot powered by **Groq's LLaMA 3.1 8B** model  
- 🔗 Context management using **LangChain**  
- ⚡ REST API with **FastAPI**  
- 🔄 Multi-turn conversation support with conversation IDs  
- 🖥️ Simple, responsive frontend using **HTML**, **CSS**, and **JavaScript**  
- 🌐 **CORS-enabled** for smooth API/frontend integration  
- 🔒 API key management using `.env` and `dotenv`

---

## 📁 Project Structure

```
groq-langchain-chat-app/
├── backend/                 # backend directory
│   ├── app.py               # backend logic
├── frontend/                 # frontend directory
│   ├── index.html           # Chat UI (frontend)
│   ├── style.css            # Frontend styling
│   └── script.js            # JS logic to handle chat and API
├── .env                     # Environment file (Groq API key)
├── requirements.txt         # Python dependencies
└── README.md                # Project documentation
```

---

## 🧪 Sample Chat Request (API)

**POST** `/chat`  
**Body:**
```json
{
  "message": "Hi there!",
  "role": "user",
  "conversation_id": "abc123"
}
```

**Response:**
```json
{
  "response": "Hello! How can I help you today?",
  "conversation_id": "abc123"
}
```

---

## ⚙️ Setup Instructions

### 🔧 Backend Setup (FastAPI + Groq)

1. **Clone the repo:**
   ```bash
   git clone https://github.com/itsmoksh05/chat-app-fastapi-langchain.git
   cd chat-app-fastapi-langchain
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Create `.env` file:**
   ```
   GROQ_API_KEY=your_groq_api_key
   ```

4. **Run the backend:**
   ```bash
   uvicorn app:app --reload
   ```

---

### 🖥️ Frontend Setup (HTML/CSS/JS)

1. Open the `frontend/index.html` file in your browser.
2. It connects to your running FastAPI server (`http://localhost:8000/chat`) via JavaScript.
3. Enter your message and chat with the bot in real time!

---

## 🧰 Tech Stack

- **Backend:**
  - Python 3.10+
  - FastAPI
  - LangChain
  - Groq API (LLaMA 3.1)
  - Pydantic
  - dotenv

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript (Vanilla)

---

## 📚 What I Learned

- Building a chatbot backend using FastAPI and LangChain
- Using the Groq LLaMA model for conversational AI
- Structuring a RESTful API with context handling
- Creating a simple frontend using only HTML, CSS, and JS
- Managing environment variables and secure API access

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [Groq API](https://console.groq.com/)
- [LangChain](https://www.langchain.com/)
- [FastAPI](https://fastapi.tiangolo.com/)

---

## 🌟 Star the repo if you found it useful or inspiring!
> 🛠️ [A Moksh Production](https://github.com/itsmoksh05) – from chaos to clarity, transforming logic into legacy.
