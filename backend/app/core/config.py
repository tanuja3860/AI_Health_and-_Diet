from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI_Health_and-_Diet API"
    DATABASE_URL: str = "postgresql://diet_user:diet_password@localhost:5432/ai_health_diet_db"
    SECRET_KEY: str = "supersecretjwtkey_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        case_sensitive = True

settings = Settings()