import os
from dotenv import load_dotenv

load_dotenv()

from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Set OpenRouter key
os.environ["OPENAI_API_KEY"] = os.getenv("OPENROUTER_API_KEY")

# -----------------------------
# Embedding Model
# -----------------------------
embedding = OpenAIEmbeddings(
    model="text-embedding-3-small",
    base_url="https://openrouter.ai/api/v1"
)

# -----------------------------
# Persistent Vector Database
# -----------------------------
DB_DIR = "resume_db"

if not os.path.exists(DB_DIR):

    print("Creating vector database...")

    loader = PyPDFLoader("resume.pdf")
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150
    )

    docs = splitter.split_documents(documents)

    vectorstore = Chroma.from_documents(
        docs,
        embedding,
        persist_directory=DB_DIR
    )

    vectorstore.persist()

    print("Vector database created.")

# Load existing DB
vectorstore = Chroma(
    persist_directory=DB_DIR,
    embedding_function=embedding
)

# -----------------------------
# Retriever
# -----------------------------
retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 5}
)

# -----------------------------
# LLM
# -----------------------------
llm = ChatOpenAI(
    model="openai/gpt-4o-mini",
    base_url="https://openrouter.ai/api/v1",
    temperature=0.2,
    max_tokens=150
)

# -----------------------------
# Prompt
# -----------------------------
template = """
You are Harsh Pandey's AI Resume Assistant.

You must answer exactly as Harsh Pandey speaking in first person.

Rules:
- Use only the resume information provided.
- Be confident and professional.
- Keep answers concise (2–4 sentences).
- If information truly does not exist, respond exactly:
  "That information is not available in my resume."

You may infer skills from:
- projects
- work experience
- internships

Resume Information:
{context}

Question:
{question}

Answer as Harsh Pandey:
"""

PROMPT = PromptTemplate(
    template=template,
    input_variables=["context", "question"],
)

# -----------------------------
# Helper: Build Compact Context
# -----------------------------
def build_context(docs):

    cleaned = []

    for doc in docs:
        text = doc.page_content.strip().replace("\n", " ")
        cleaned.append(text)

    return " ".join(cleaned)

# -----------------------------
# Main Function
# -----------------------------
def ask_resume(question: str):

    docs = retriever.invoke(question)

    context = build_context(docs)

    prompt = PROMPT.format(
        context=context,
        question=question
    )

    response = llm.invoke(prompt)

    return response.content


# -----------------------------
# Warm up model (faster first request)
# -----------------------------
try:
    llm.invoke("Hello")
except:
    pass