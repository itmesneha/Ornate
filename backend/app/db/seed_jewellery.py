from app.db.session import SessionLocal
from app.models.jewellery import Jewellery

def seed_jewellery():
    db = SessionLocal()

    jewellery_items = [
        Jewellery(
            image_url="https://example.com/temple-necklace.jpg",
            category="necklace",
            style=["traditional"],
            outfit_type=["saree", "lehenga"],
            occasion=["wedding", "festive"],
            primary_colors=["gold"],
            secondary_colors=["red"],
            material="gold",
            notes="Bridal temple necklace"
        ),
        Jewellery(
            image_url="https://example.com/choker.jpg",
            category="necklace",
            style=["modern"],
            outfit_type=["gown"],
            occasion=["party"],
            primary_colors=["silver"],
            secondary_colors=["white"],
            material="silver",
            notes="Minimal choker"
        ),
        Jewellery(
            image_url="https://example.com/jhumka.jpg",
            category="earrings",
            style=["traditional"],
            outfit_type=["saree", "kurti"],
            occasion=["festive"],
            primary_colors=["gold"],
            secondary_colors=["green"],
            material="gold",
            notes="Antique jhumkas"
        ),
        Jewellery(
            image_url="https://example.com/bangles.jpg",
            category="bangles",
            style=["traditional"],
            outfit_type=["saree"],
            occasion=["wedding"],
            primary_colors=["gold"],
            secondary_colors=["red"],
            material="gold",
            notes="Bridal bangles set"
        ),
    ]

    db.add_all(jewellery_items)
    db.commit()
    db.close()

    print("✅ Jewellery data seeded successfully")

if __name__ == "__main__":
    seed_jewellery()
