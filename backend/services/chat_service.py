from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware
from langchain.chat_models import init_chat_model
from langchain.tools import tool
from services.db_client import get_vector_store, get_chat_history

def create_retrieve_tool(session_id: str):
    """Create session-specific retrieval tool using closure"""
    @tool
    def retrieve_context(query: str, k: int = 5):
        """Retrieve relevant information from research paper user selected to answer questions."""
        vector_store, _ = get_vector_store(session_id)
        docs = vector_store.similarity_search(query, k=k)
        if not docs:
            return "No papers found in this session. Please load a paper first using the select-paper endpoint."
        serialized = "\n\n".join(
            f"Source: {doc.metadata}\nContent: {doc.page_content}"
            for doc in docs
        )
        return serialized
    return retrieve_context

def chat_with_papers(session_id: str, query: str):
    """Chat with papers using agent - LLM handles everything"""
    llm = init_chat_model("gpt-4o-mini", temperature=0.2)
    
    chat_history = get_chat_history(session_id)
    retrieve_context = create_retrieve_tool(session_id)
    
    # Create agent with summarization middleware
    agent = create_agent(
        llm,
        tools=[retrieve_context],
        middleware=[
            SummarizationMiddleware(
                model="gpt-4o-mini",
                trigger=("fraction", 0.5),
                keep=("fraction", 0.2),
            ),
        ],
        system_prompt="""You are a helpful research assistant specialized in clarifying and explaining academic papers.

Your primary goal is to help users understand research papers by providing clear, comprehensive answers to their questions.

How you work:
1. You have access to a tool called 'retrieve_context' that searches through the research paper for relevant information
2. Whenever a user asks a question about the paper, ALWAYS use this tool first to find the relevant sections
3. You also have access to the conversation history, so you can provide contextual answers based on previous discussions

Your approach:
- Start by retrieving relevant information from the paper using the retrieve_context tool
- Carefully read and understand what the user is asking
- Synthesize the retrieved information into a clear, well-structured response
- If the user's question is unclear, ask clarifying questions
- Provide comprehensive explanations that directly address their query
- Use examples from the paper when helpful
- If the retrieved information doesn't fully answer the question, acknowledge what's missing and explain what you found instead

Remember:
- ALWAYS call retrieve_context before answering questions about the paper
- Base your answers on the actual content retrieved from the paper
- Be conversational and helpful in your tone
- Focus on making complex research accessible and understandable"""
    )
    
    # Get chat history
    history = chat_history.get_messages()
    
    # Invoke agent
    response = agent.invoke({
        "messages": [
            *history,
            {"role": "user", "content": query}
        ]
    })
    
    output = response["messages"][-1].content
    
    # Save to history
    chat_history.add_user_message(query)
    chat_history.add_ai_message(output)
    
    return output, None
