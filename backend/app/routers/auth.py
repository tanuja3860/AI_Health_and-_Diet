import os
import random
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from datetime import datetime, timedelta
import jwt
from twilio.rest import Client

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

SECRET_KEY = "YOUR_SUPER_SECRET_KEY"
ALGORITHM = "HS256"

# Twilio Credentials (Set these in your environment variables or replace directly)
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "YOUR_TWILIO_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "YOUR_TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER", "+1234567890")

OTP_STORE = {}

class PhoneAuthRequest(BaseModel):
    phone: str

class OTPVerifyRequest(BaseModel):
    phone: str
    otp: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/send-otp")
async def send_otp(request: PhoneAuthRequest):
    # Generate a real random 6-digit OTP
    otp = str(random.randint(100000, 999999))
    OTP_STORE[request.phone] = otp

    # Dispatch SMS via Twilio API
    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        message = client.messages.create(
            body=f"Your Clinical AI verification code is: {otp}",
            from_=TWILIO_PHONE_NUMBER,
            to=request.phone
        )
        return {"status": "success", "message": f"OTP sent to {request.phone}"}
    except Exception as e:
        # If Twilio credentials aren't set yet, log error and fall back to test OTP
        print(f"Twilio SMS Error: {str(e)}")
        return {
            "status": "warning", 
            "message": "Failed to send SMS. Use test code 123456.",
            "dev_otp": "123456"
        }

@router.post("/verify-otp")
async def verify_otp(request: OTPVerifyRequest):
    stored_otp = OTP_STORE.get(request.phone)
    
    # Verify against generated OTP or fallback code 123456
    if request.otp == stored_otp or request.otp == "123456":
        access_token = create_access_token(data={"sub": request.phone})
        return {"access_token": access_token, "token_type": "bearer"}
    
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid OTP code."
    )