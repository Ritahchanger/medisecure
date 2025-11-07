from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from cryptography.fernet import Fernet
import os, json

app = FastAPI(title="Medical Encryption Service ✅")

KEY_FILE = "secret.key"

# Internal service-to-service secret
INTERNAL_API_KEY = os.environ.get("INTERNAL_API_KEY", "DEFAULT_SERVICE_SECRET")

# Load or create encryption key
def load_key():
    if os.path.exists(KEY_FILE):
        with open(KEY_FILE, "rb") as f:
            return f.read()
    key = Fernet.generate_key()
    with open(KEY_FILE, "wb") as f:
        f.write(key)
    return key


fernet = Fernet(load_key())


# ✅ Optional: Strict File Schema Matching Mongoose
class FileItem(BaseModel):
    fileUrl: str
    fileDownloadUrl: str
    uploadedAt: str | None = None
    uploadedBy: str | None = None


# ✅ Main Encryption Request (matches Mongoose)
class EncryptRequest(BaseModel):
    data: dict  # the entire patient medical JSON including "files": []


class DecryptRequest(BaseModel):
    data: str  # encrypted string from MongoDB


@app.get("/")
async def index():
    return {"message": "Python Encryption Service ✅ Running"}


@app.post("/encrypt")
async def encrypt(req: EncryptRequest, x_internal_key: str = Header(None)):
    # ✅ Ensure only Node backend can call this microservice
    if x_internal_key != INTERNAL_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized microservice request")

    try:
        # ✅ Convert the entire medical JSON into encrypted string
        json_str = json.dumps(req.data)
        encrypted = fernet.encrypt(json_str.encode())

        return {"encrypted": encrypted.decode()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/decrypt")
async def decrypt(req: DecryptRequest, x_internal_key: str = Header(None)):
    if x_internal_key != INTERNAL_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized microservice request")

    try:
        decrypted = fernet.decrypt(req.data.encode()).decode()
        return {"decrypted": json.loads(decrypted)}
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid encrypted data")
