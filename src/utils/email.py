from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from src.core.config import settings

# Global SMTP config (from .env)
conf = ConnectionConfig(
   MAIL_USERNAME=settings.MAIL_USERNAME,
   MAIL_PASSWORD=settings.MAIL_PASSWORD,
   MAIL_PORT=587,
   MAIL_SERVER=settings.MAIL_SERVER,
   MAIL_STARTTLS=True,
   MAIL_SSL_TLS=False,
   USE_CREDENTIALS=True
)

async def send_credentials_email(email_to: str, username: str, password: str):
    """
    Send async credentials email to the new user.
    """
    subject = "Welcome! Your Account Credentials"
    
    html_body = f"""
    <html>
        <body>
            <h1>Welcome, {username}!</h1>
            <p>Your account has been created successfully.</p>
            <ul>
                <li><strong>Username:</strong> {username}</li>
                <li><strong>Password:</strong> {password}</li>
                <li><strong>Email:</strong> {email_to}</li>
            </ul>
            <p>Please change your password after logging in for security.</p>
            <p>If you didn't request this, contact support.</p>
        </body>
    </html>
    """
    
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        body=html_body,
        subtype="html"
    )
    
    fm = FastMail(conf)
    try:
        await fm.send_message(message)
    except Exception as e:
        # Log error (use your logger here, e.g., logger.error(f"Email failed for {email_to}: {e}"))
        print(f"Email send failed for {email_to}: {e}")  # Fallback for demo