from typing import List, Optional
from pydantic import BaseModel, HttpUrl
from uuid import UUID
from datetime import datetime

class JewelleryBase(BaseModel):
    image_url: HttpUrl
    category: str

    style: Optional[List[str]] = []
    outfit_type: Optional[List[str]] = []
    occasion: Optional[List[str]] = []

    primary_colors: Optional[List[str]] = []
    secondary_colors: Optional[List[str]] = []

    material: Optional[str] = None
    notes: Optional[str] = None


class JewelleryCreate(JewelleryBase):
    pass


class JewelleryRead(JewelleryBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
