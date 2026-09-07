from sqlalchemy import Column, Integer, String, Float, JSON, Boolean
from app.database.database import Base

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    prep_time_mins = Column(Integer, nullable=False)
    calories = Column(Float, nullable=False)
    protein_g = Column(Float, nullable=False)
    carbs_g = Column(Float, nullable=False)
    fats_g = Column(Float, nullable=False)
    ingredients = Column(JSON, nullable=False)
    is_takeout_option = Column(Boolean, default=False)