from fastapi import FastAPI
from app.api import ornate

app = FastAPI(title="Ornate API")

app.include_router(ornate.router, prefix="/ornate")
