"""Shared database clients for ChromaDB and SQLite"""

import chromadb
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_community.chat_message_histories import SQLChatMessageHistory

# Singleton ChromaDB client
_chroma_client = None

def get_chroma_client():
    """Get or create ChromaDB persistent client"""
    global _chroma_client
    if _chroma_client is None:
        _chroma_client = chromadb.PersistentClient(path="./chroma_langchain_db")
    return _chroma_client

def get_vector_store(session_id: str):
    """Get vector store for a session"""
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    safe_session_id = "".join(c if c.isalnum() or c in "._-" else "_" for c in session_id)
    collection_name = f"papers_{safe_session_id}"[:63]
    
    client = get_chroma_client()
    return Chroma(
        client=client,
        collection_name=collection_name,
        embedding_function=embeddings,
    ), collection_name

def get_chat_history(session_id: str):
    """Get chat history for a session"""
    return SQLChatMessageHistory(
        session_id=session_id,
        connection="sqlite:///chat_history.db"
    )
