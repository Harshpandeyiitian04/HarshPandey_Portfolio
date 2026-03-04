from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag import ask_resume

app = FastAPI()

# Allowed frontend origins
origins = [
    "https://harsh-pandey-portfolio.vercel.app",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Query(BaseModel):
    question: str


@app.get("/")
def root():
    return {"message": "Resume AI Backend Running"}


@app.post("/chat")
async def chat(query: Query):

    answer = ask_resume(query.question)

    return {"answer": answer}