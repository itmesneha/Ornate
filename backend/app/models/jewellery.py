import uuid
from sqlalchemy import Column, String, DateTime, JSON
from sqlalchemy.sql import func
from sqlalchemy.types import TypeDecorator, CHAR
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

from app.db.session import Base

# UUID type that works with both SQLite and PostgreSQL
class UUID(TypeDecorator):
    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        else:
            return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == 'postgresql':
            return str(value)
        else:
            if isinstance(value, uuid.UUID):
                return str(value)
            return value

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        if isinstance(value, uuid.UUID):
            return value
        return uuid.UUID(value)

class Jewellery(Base):
    __tablename__ = "jewellery"

    id = Column(UUID(), primary_key=True, default=uuid.uuid4)

    name = Column(String, nullable=True)
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
