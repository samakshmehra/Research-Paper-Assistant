# Research Paper Assistant - Backend

A FastAPI-based backend service that enables intelligent research paper discovery and interaction using RAG (Retrieval-Augmented Generation).

## Features

- 🔍 **Smart Paper Search**: Uses LLM to generate diverse arXiv queries for comprehensive results
- 🎯 **Intelligent Reranking**: Cross-encoder reranking for highly relevant results
- 📄 **Document Processing**: Advanced PDF chunking with Docling's HybridChunker
- 💬 **Interactive Chat**: RAG-powered chat interface for paper Q&A
- 🗄️ **Session Management**: ChromaDB for vector storage and SQLite for chat history

## Tech Stack

- **Framework**: FastAPI
- **LLM Integration**: LangChain with OpenAI
- **Document Processing**: Docling, langchain-docling
- **Vector Database**: ChromaDB with OpenAI embeddings
- **Reranking**: Cross-encoder (ms-marco-MiniLM-L-6-v2)
- **Paper Source**: arXiv API

## Prerequisites

- Python 3.11+
- OpenAI API key

## Installation

1. **Create a virtual environment**:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Set up environment variables**:
Create a `.env` file in the backend directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

## Running the Server

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### 1. Search Papers
**POST** `/api/search-papers`

Search arXiv for relevant papers based on a topic.

**Request**:
```json
{
  "topic": "YOLO object detection"
}
```

**Response**:
```json
{
  "session_id": "uuid-string",
  "papers": [
    {
      "title": "Paper Title",
      "pdf_url": "https://arxiv.org/pdf/...",
      "published": "2024-01-01",
      "summary": "Paper abstract..."
    }
  ],
  "expanded_intent": "Detailed research intent..."
}
```

### 2. Select Paper
**POST** `/api/select-paper`

Load a selected paper into the session for chat.

**Request**:
```json
{
  "session_id": "uuid-string",
  "pdf_url": "https://arxiv.org/pdf/..."
}
```

**Response**:
```json
{
  "session_id": "uuid-string",
  "message": "Paper loaded successfully",
  "chunks_count": 150
}
```

### 3. Chat with Paper
**POST** `/api/chat`

Ask questions about the loaded paper.

**Request**:
```json
{
  "session_id": "uuid-string",
  "query": "What is the main contribution of this paper?"
}
```

**Response**:
```json
{
  "session_id": "uuid-string",
  "answer": "The main contribution is...",
  "retrieved_content": null
}
```

## Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── routers/
│   └── research_router.py  # API endpoints
├── services/
│   ├── paper_service.py    # Paper search & loading logic
│   ├── chat_service.py     # RAG chat implementation
│   └── db_client.py        # Database clients (ChromaDB, SQLite)
├── schemas/
│   ├── __init__.py
│   └── schemas.py          # Pydantic models
├── requirements.txt        # Python dependencies
└── .env                    # Environment variables (create this)
```

## How It Works

1. **Search Phase**:
   - LLM generates 3 diverse arXiv queries from user input
   - Fetches papers from arXiv API
   - Deduplicates results
   - Reranks using cross-encoder for relevance

2. **Loading Phase**:
   - Downloads selected PDF from arXiv
   - Chunks document using HybridChunker
   - Stores chunks in session-specific ChromaDB collection

3. **Chat Phase**:
   - Retrieves relevant chunks using vector similarity search
   - LangChain agent uses RAG to answer questions
   - Maintains conversation history in SQLite

## Development

- API documentation available at `http://localhost:8000/docs`
- Interactive API testing at `http://localhost:8000/redoc`

## Notes

- Database files (`chat_history.db`, `chroma_langchain_db/`) are created automatically on first run
- Each session has its own ChromaDB collection and chat history
- Sessions persist across server restarts
