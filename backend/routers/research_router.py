from fastapi import APIRouter, HTTPException
from schemas import (
    ChatRequest, ChatResponse,
    SearchPapersRequest, SearchPapersResponse, PaperInfo,
    SelectPaperRequest, SelectPaperResponse
)
from services.chat_service import chat_with_papers
from services.paper_service import search_papers, load_and_store_paper
import uuid

router = APIRouter(prefix="/api", tags=["research"])

@router.post("/search-papers", response_model=SearchPapersResponse)
async def search_research_papers(request: SearchPapersRequest):
    """
    Endpoint 1: Search arXiv papers based on topic
    - Generates 3 queries using LLM
    - Searches arXiv
    - Deduplicates and reranks with cross-encoder
    - Returns top 5 papers
    """
    try:
        session_id = str(uuid.uuid4())
        papers, expanded_intent = search_papers(request.topic)
        
        paper_list = [
            PaperInfo(
                title=paper.title,
                pdf_url=paper.pdf_url,
                published=str(paper.published),
                summary=paper.summary
            )
            for paper in papers
        ]
        
        return SearchPapersResponse(
            session_id=session_id,
            papers=paper_list,
            expanded_intent=expanded_intent
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/select-paper", response_model=SelectPaperResponse)
async def select_and_load_paper(request: SelectPaperRequest):
    """
    Endpoint 2: User selects a paper to load
    - Downloads PDF
    - Chunks with HybridChunker
    - Stores in session-specific ChromaDB collection
    """
    try:
        chunks_count = load_and_store_paper(request.session_id, request.pdf_url)
        
        return SelectPaperResponse(
            session_id=request.session_id,
            message="Paper loaded successfully",
            chunks_count=chunks_count
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Endpoint 3: Chat with loaded papers
    - Retrieves relevant chunks from ChromaDB
    - Uses LLM with RAG to answer
    - Maintains chat history in SQLite
    """
    try:
        answer, retrieved_content = chat_with_papers(request.session_id, request.query)
        
        return ChatResponse(
            session_id=request.session_id,
            answer=answer,
            retrieved_content=retrieved_content
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
