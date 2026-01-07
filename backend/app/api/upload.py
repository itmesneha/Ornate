import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.utils.supabase import supabase
import os
from dotenv import load_dotenv
from PIL import Image
import io

load_dotenv()

router = APIRouter()

BUCKET = os.getenv("SUPABASE_BUCKET", "jewellery-images")

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    print(f"Received file: {file.filename}, Content-Type: {file.content_type}")  # Debug
    
    # Accept more content type variations
    allowed_types = [
        "image/jpeg", "image/jpg", "image/png", "image/webp",
        "application/octet-stream"  # Some clients send this for images
    ]
    
    if file.content_type is None:
    # allow and infer from extension later
        pass
    elif file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}"
        )


    # Get file extension
    file_ext = "jpg"  # default
    if file.filename and "." in file.filename:
        file_ext = file.filename.split(".")[-1].lower()
    elif file.content_type in ["image/jpeg", "image/jpg"]:
        file_ext = "jpg"
    elif file.content_type == "image/png":
        file_ext = "png"
    elif file.content_type == "image/webp":
        file_ext = "webp"
    
    filename = f"{uuid.uuid4()}.{file_ext}"

    # Read file content as bytes
    await file.seek(0)  # Reset file pointer to beginning
    content = await file.read()
    
    print(f"File size: {len(content)} bytes")  # Debug log
    
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Empty file - no content received")
    
    try:
        image = Image.open(io.BytesIO(content))
        image.verify()  # verifies header integrity
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is not a valid image"
        )

    # Determine actual content type for storage
    content_type_map = {
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "webp": "image/webp"
    }
    storage_content_type = content_type_map.get(file_ext, "image/jpeg")

    try:
        # Upload with proper file_options
        res = supabase.storage.from_(BUCKET).upload(
            path=filename,
            file=content,
            file_options={"content-type": storage_content_type}
        )
        
        # Get public URL
        public_url = supabase.storage.from_(BUCKET).get_public_url(filename)
        
        return {
            "image_url": public_url,
            "filename": filename,
            "size": len(content)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
