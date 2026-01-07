from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.schemas.jewellery import JewelleryCreate, JewelleryUpdate, JewelleryRead
from app.models.jewellery import Jewellery
from app.db.deps import get_db

router = APIRouter(prefix="/jewellery", tags=["jewellery"])


@router.post("/", response_model=JewelleryRead)
def create_jewellery(
    jewellery_in: JewelleryCreate,
    db: Session = Depends(get_db),
):
    jewellery = Jewellery(
        name=jewellery_in.name,
        image_url=str(jewellery_in.image_url),
        category=jewellery_in.category,
        style=jewellery_in.style,
        outfit_type=jewellery_in.outfit_type,
        occasion=jewellery_in.occasion,
        primary_colors=jewellery_in.primary_colors,
        secondary_colors=jewellery_in.secondary_colors,
        material=jewellery_in.material,
        notes=jewellery_in.notes,
    )

    db.add(jewellery)
    db.commit()
    db.refresh(jewellery)

    return jewellery

from typing import Optional
from fastapi import Query

@router.get("/", response_model=list[JewelleryRead])
def list_jewellery(
    category: Optional[str] = None,
    occasion: Optional[str] = None,
    outfit_type: Optional[str] = None,
    color: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Jewellery)

    if category:
        query = query.filter(Jewellery.category.ilike(f"%{category}%"))

    if occasion:
        query = query.filter(Jewellery.occasion.contains([occasion]))

    if outfit_type:
        query = query.filter(Jewellery.outfit_type.contains([outfit_type]))

    if color:
        query = query.filter(
            (Jewellery.primary_colors.contains([color])) |
            (Jewellery.secondary_colors.contains([color]))
        )
    
    # Text search across multiple fields
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Jewellery.category.ilike(search_term)) |
            (Jewellery.material.ilike(search_term)) |
            (Jewellery.notes.ilike(search_term))
        )

    return query.all()


@router.put("/{jewellery_id}", response_model=JewelleryRead)
def update_jewellery(
    jewellery_id: UUID,
    jewellery_update: JewelleryUpdate,
    db: Session = Depends(get_db),
):
    jewellery = db.query(Jewellery).filter(Jewellery.id == jewellery_id).first()
    
    if not jewellery:
        raise HTTPException(status_code=404, detail="Jewellery not found")
    
    # Update only the fields that are provided
    update_data = jewellery_update.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        if field == "image_url" and value is not None:
            setattr(jewellery, field, str(value))
        else:
            setattr(jewellery, field, value)
    
    db.commit()
    db.refresh(jewellery)
    
    return jewellery
