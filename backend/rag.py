import os
from dotenv import load_dotenv
load_dotenv()

from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.prompts import PromptTemplate
from langchain_community.chat_models.openai import ChatOpenAI

# 🔐 Map OpenRouter key to OpenAI key
os.environ["OPENAI_API_KEY"] = os.getenv("OPENROUTER_API_KEY")

# 📄 Load Resume
loader = PyPDFLoader("resume.pdf")
documents = loader.load()

# 🧠 Create Embeddings (Free Local Model)
embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# 📦 Store in Vector DB
vectorstore = Chroma.from_documents(documents, embedding)

retriever = vectorstore.as_retriever(
    search_kwargs={"k": 4}  # Retrieve top 4 relevant chunks
)

# 🤖 OpenRouter LLM
llm = ChatOpenAI(
    model="openai/gpt-4o-mini",
    openai_api_base="https://openrouter.ai/api/v1",
    temperature=0.2,
)

# 🎯 Strong Professional Prompt
template = """
You are Harsh Pandey's AI Resume Assistant.

Your job:
- Answer as if YOU are Harsh Pandey.
- Speak in first person.
- Be professional and confident.
- ONLY use information from the provided resume context.
- DO NOT guess or fabricate any information.
- If the information is not found in the context, respond EXACTLY with:
  "That information is not available in my resume."

Guidelines:
- If asked about education → Mention IIT Mandi clearly.
- If asked about GPA → Mention CGPA clearly.
- If asked about projects → Mention project names properly.
- If asked about skills → Present them clearly.
- Keep responses concise but meaningful (2–4 sentences max).
- Do NOT mention the word "context".
- Do NOT say "according to the resume".
- Answer naturally like a real human introducing himself.

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
    docs = retriever.get_relevant_documents(question)

    context = "\n\n".join([doc.page_content for doc in docs])

    formatted_prompt = PROMPT.format(
        context=context,
        question=question
    )

    response = llm.invoke(formatted_prompt)

    return response.content