from pydantic import BaseModel, Field
from typing import List, Optional

# ==================== CHAT SCHEMAS ====================
class ChatRequest(BaseModel):
    session_id: str
    query: str

class ChatResponse(BaseModel):
    session_id: str
    answer: str
    retrieved_content: Optional[str] = None


# ==================== SEARCH PAPERS SCHEMAS ====================
class SearchPapersRequest(BaseModel):
    topic: str

class PaperInfo(BaseModel):
    title: str
    pdf_url: str
    published: str
    summary: str

class SearchPapersResponse(BaseModel):
    session_id: str
    papers: List[PaperInfo]
    expanded_intent: str


# ==================== SELECT PAPER SCHEMAS ====================
class SelectPaperRequest(BaseModel):
    session_id: str
    pdf_url: str

class SelectPaperResponse(BaseModel):
    session_id: str
    message: str
    chunks_count: int


# ==================== INTERNAL SCHEMAS (Not exposed to API) ====================
class UserIntentClassifier(BaseModel):
    """Internal schema for LLM structured output - generates search queries"""
    query1: str = Field(description="First arXiv search query capturing the core intent")
    query2: str = Field(description="Second arXiv search query using alternative terminology")
    query3: str = Field(description="Third arXiv search query exploring a related sub-area")
    expanded_intent: str = Field(description="A detailed, research-oriented expansion of the user's intent for semantic reranking")
