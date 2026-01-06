import uuid
from sqlalchemy import Column, String, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.db.session import Base

class Jewellery(Base):
    __tablename__ = "jewellery"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    image_url = Column(String, nullable=False)
    category = Column(String, nullable=False)

    # Multi-label fields stored as JSON arrays
    style = Column(JSON, nullable=True)
    outfit_type = Column(JSON, nullable=True)
    occasion = Column(JSON, nullable=True)

    primary_colors = Column(JSON, nullable=True)
    secondary_colors = Column(JSON, nullable=True)

    material = Column(String, nullable=True)
    notes = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
