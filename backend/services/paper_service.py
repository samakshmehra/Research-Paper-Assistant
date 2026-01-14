from langchain.chat_models import init_chat_model
from langchain.messages import SystemMessage, HumanMessage
from langchain_docling import DoclingLoader
from docling.chunking import HybridChunker
from langchain_community.vectorstores.utils import filter_complex_metadata
from sentence_transformers import CrossEncoder
import arxiv
from services.db_client import get_chroma_client, get_vector_store
from schemas import UserIntentClassifier

def get_user_intent(user_query: str) -> UserIntentClassifier:
    model = init_chat_model("gpt-4o-mini", temperature=0.2)
    structured_model = model.with_structured_output(UserIntentClassifier)
    
    messages = [
        SystemMessage(
            content=(
                "You are an expert research assistant. "
                "Your task is to expand a user's research intent and generate "
                "three diverse arXiv search queries to maximize recall. "
                "IMPORTANT: If the user query looks like a paper title (short phrase), "
                "use it EXACTLY as query1 wrapped in quotes like: all:\"exact title\". "
                "For query2 and query3, use different terminology and perspectives. "
                "The expanded_intent should describe what the user wants to find - "
                "if they search for a specific paper title, expanded_intent should describe "
                "the paper's topic and contributions for better semantic reranking."
            )
        ),
        HumanMessage(content=f"User research query: {user_query}")
    ]
    return structured_model.invoke(messages)

def arxiv_search(query: str):
    client = arxiv.Client()
    search = arxiv.Search(
        query=query, 
        max_results=5, 
        sort_by=arxiv.SortCriterion.Relevance
    )
    return list(client.results(search))

def iterate_queries_and_search(user_query: str):
    intent_response = get_user_intent(user_query)
    all_results = []
    
    for query in [intent_response.query1, intent_response.query2, intent_response.query3]:
        results = arxiv_search(query)
        all_results.extend(results)
    
    return all_results, intent_response.expanded_intent

def deduplicate_by_arxiv_id(papers):
    unique = {}
    for paper in papers:
        unique[paper.entry_id] = paper
    return list(unique.values())

def rerank_with_cross_encoder(expanded_intent: str, papers, top_k: int = 10):
    cross_encoder = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
    
    pairs = [[expanded_intent, f"{paper.title}. {paper.summary}"] for paper in papers]
    scores = cross_encoder.predict(pairs)
    
    scored_papers = sorted(zip(papers, scores), key=lambda x: x[1], reverse=True)
    return [paper for paper, score in scored_papers[:top_k]]

def search_papers(topic: str):
    """
    Search arXiv papers using LLM-generated queries
    - Generates 3 diverse queries
    - Searches arXiv
    - Deduplicates results
    - Reranks with cross-encoder
    """
    all_papers, expanded_intent = iterate_queries_and_search(topic)
    unique_papers = deduplicate_by_arxiv_id(all_papers)
    top_papers = rerank_with_cross_encoder(expanded_intent, unique_papers, top_k=10)
    
    return top_papers, expanded_intent

def load_and_store_paper(session_id: str, pdf_url: str):
    """
    Load selected paper and store in session-specific ChromaDB
    - Downloads PDF from arXiv
    - Chunks with HybridChunker
    - Stores in papers_{session_id} collection
    """
    loader = DoclingLoader(file_path=pdf_url, chunker=HybridChunker())
    docs = loader.load()
    
    filtered_docs = filter_complex_metadata(docs)
    
    # Get vector store and collection name
    vector_store, collection_name = get_vector_store(session_id)
    client = get_chroma_client()
    
    # Delete collection if it exists to start fresh
    try:
        client.delete_collection(collection_name)
        vector_store, collection_name = get_vector_store(session_id)
    except:
        pass
    
    # Add documents
    vector_store.add_documents(filtered_docs)
    
    # Verify by checking collection count
    collection = client.get_collection(collection_name)
    actual_count = collection.count()
    
    if actual_count == 0:
        raise Exception(f"Failed to store documents. Expected {len(filtered_docs)}, got {actual_count}")
    
    return actual_count


