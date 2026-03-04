from fastapi import FastAPI
from pydantic import BaseModel
from rag import ask_resume

app = FastAPI()


class Query(BaseModel):
    question: str


@app.get("/")
def root():
    return {"message": "Resume AI Backend Running"}


@app.post("/chat")
async def chat(query: Query):

    answer = ask_resume(query.question)

    return {"answer": answer}