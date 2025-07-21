from fastapi import FastAPI
from app.api.v1 import user, similarity

app = FastAPI()

app.include_router(user.router, prefix="/api/v1", tags=["Users"])
app.include_router(similarity.router, prefix="/api/v1", tags=["Similarity"])



from fastapi.routing import APIRoute
for route in app.routes:
    if isinstance(route, APIRoute):
        print(f"{route.path} -> {route.name}")