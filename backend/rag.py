import os
from dotenv import load_dotenv

load_dotenv()

from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_core.prompts import PromptTemplate

os.environ["OPENAI_API_KEY"] = os.getenv("OPENROUTER_API_KEY")

# Embeddings
embedding = OpenAIEmbeddings(
    model="text-embedding-3-small",
    base_url="https://openrouter.ai/api/v1"
)

# Persistent vector DB folder
DB_DIR = "resume_db"

# Create DB only once
if not os.path.exists(DB_DIR):

    loader = PyPDFLoader("resume.pdf")
    documents = loader.load()

    vectorstore = Chroma.from_documents(
        documents,
        embedding,
        persist_directory=DB_DIR
    )

    vectorstore.persist()

# Load DB instantly
vectorstore = Chroma(
    persist_directory=DB_DIR,
    embedding_function=embedding
)

retriever = vectorstore.as_retriever(
    search_kwargs={"k": 4}
)

# LLM
llm = ChatOpenAI(
    model="openai/gpt-4o-mini",
    base_url="https://openrouter.ai/api/v1",
    temperature=0.2
)

# Prompt
template = """
You are Harsh Pandey's AI Resume Assistant.

Answer as Harsh Pandey in first person.

Only use the resume information below.

If information is not found respond exactly:
"That information is not available in my resume."

Resume Context:
{context}

Question:
{question}

Answer:
"""

PROMPT = PromptTemplate(
    template=template,
    input_variables=["context", "question"],
)


def ask_resume(question: str):

    docs = retriever.invoke(question)

    context = "\n\n".join([doc.page_content for doc in docs])

    prompt = PROMPT.format(
        context=context,
        question=question
    )

    response = llm.invoke(prompt)

    return response.content