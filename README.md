# Research Paper Assistant 📚

An intelligent research paper discovery and interaction platform powered by AI. Search arXiv papers with natural language queries and chat with papers using RAG (Retrieval-Augmented Generation).

![Research Paper Assistant](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge)

## ✨ Features

### 🔍 Smart Paper Discovery
- **Natural Language Search**: Describe what you're looking for in plain English
- **Multi-Query Generation**: LLM generates 3 diverse arXiv queries for comprehensive coverage
- **Intelligent Reranking**: Cross-encoder reranking ensures the most relevant papers appear first
- **Intent Understanding**: Expands your search intent for better semantic matching

### 💬 Interactive Paper Chat
- **RAG-Powered Q&A**: Ask questions and get answers grounded in the paper's content
- **Context-Aware**: Maintains conversation history for natural dialogue
- **Precise Retrieval**: Hybrid chunking and vector search for accurate information retrieval
- **Session Management**: Each paper gets its own isolated chat session

### 🎨 Premium UI/UX
- **Modern Design**: Sleek, responsive interface with smooth animations
- **Loading Experience**: Stepped loading animations with visual feedback
- **Paper Cards**: Beautiful paper previews with key information
- **Seamless Navigation**: Intuitive flow from search to chat

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  React + Vite + TailwindCSS + Framer Motion                │
│  - Landing Page  - Search Results  - Paper Chat            │
└─────────────────┬───────────────────────────────────────────┘
                  │ REST API
┌─────────────────▼───────────────────────────────────────────┐
│                         Backend                             │
│                    FastAPI + LangChain                      │
├─────────────────────────────────────────────────────────────┤
│  Search Service          Chat Service                       │
│  - LLM Query Gen         - RAG Agent                        │
│  - arXiv API             - Vector Retrieval                 │
│  - Cross-Encoder         - Chat History                     │
│  - Reranking                                                │
└─────────────────┬───────────────────────────────────────────┘
                  │
        ┌─────────┴──────────┐
        ▼                    ▼
   ┌─────────┐         ┌──────────┐
   │ChromaDB │         │ SQLite   │
   │Vectors  │         │ History  │
   └─────────┘         └──────────┘
```

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: TailwindCSS with custom design system
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Markdown**: react-markdown with remark-gfm
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI
- **LLM Integration**: LangChain + OpenAI (GPT-4o-mini)
- **Document Processing**: Docling with HybridChunker
- **Vector Database**: ChromaDB with OpenAI embeddings
- **Reranking**: Cross-encoder (ms-marco-MiniLM-L-6-v2)
- **Paper Source**: arXiv API
- **Chat History**: SQLite

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **OpenAI API Key**

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Research_paper_project
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

## 🎯 Running the Application

### Start Backend Server

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload
```

Backend will run at `http://localhost:8000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will run at `http://localhost:5173`

## 📖 Usage

1. **Search for Papers**
   - Enter a research topic or paper title on the landing page
   - The system generates diverse queries and searches arXiv
   - View reranked results with relevance scores

2. **Select a Paper**
   - Click on any paper card to open it
   - The system downloads and processes the PDF
   - Chunks are stored in a session-specific vector database

3. **Chat with the Paper**
   - Ask questions about the paper in natural language
   - Get answers grounded in the paper's actual content
   - Continue the conversation with context awareness

## 📁 Project Structure

```
Research_paper_project/
├── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── routers/
│   │   └── research_router.py  # API endpoints
│   ├── services/
│   │   ├── paper_service.py    # Paper search & loading
│   │   ├── chat_service.py     # RAG chat logic
│   │   └── db_client.py        # Database clients
│   ├── schemas/
│   │   └── schemas.py          # Pydantic models
│   ├── requirements.txt
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── components/         # Reusable UI components
    │   ├── pages/              # Page components
    │   │   ├── LandingPage.jsx
    │   │   ├── ResultsPage.jsx
    │   │   └── PaperView.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── README.md
```

## 🔑 Environment Variables

### Backend (.env)
```env
OPENAI_API_KEY=your_openai_api_key_here
```

## 🌐 API Endpoints

- **POST** `/api/search-papers` - Search arXiv papers
- **POST** `/api/select-paper` - Load a paper for chat
- **POST** `/api/chat` - Chat with loaded paper

Full API documentation available at `http://localhost:8000/docs`

## 🎨 Design Philosophy

- **Premium First Impressions**: Rich aesthetics with vibrant colors and smooth animations
- **User-Centric**: Intuitive navigation and clear visual feedback
- **Performance**: Optimized loading states and efficient data handling
- **Accessibility**: Semantic HTML and responsive design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **arXiv** for providing free access to research papers
- **LangChain** for the RAG framework
- **Docling** for advanced document processing
- **OpenAI** for LLM capabilities

---

**Built with ❤️ for researchers and knowledge seekers**
