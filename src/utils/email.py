from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from src.core.config import settings
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent  # goes from utils → src → SisHub
logo_path = BASE_DIR / "assets" / "image" / "logo.png"

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

async def send_credentials_email(email_to: str, username: str, password: str, fullname: str):
    """
    Send async credentials email to the new user.
    """
    subject = "Welcome! Your Account Credentials"
    html_body = f"""
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Sri Ramachandra Digilearn - Credentials</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {{margin: 20px !important;padding: 0;font-family: Arial, Helvetica, sans-serif;}}
                    .email-container {{max-width: 640px;margin: 0 auto;background-color: #ffffff;box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;border-radius: 1%;}}
                    .header-image img {{width: 100%;display: block;}}
                    .content {{padding: 24px;}}
                    .content h1 {{font-size: 22px;font-weight: bold;color: #222;margin-bottom: 16px;}}
                    .content p {{font-size: 14px;color: #444;line-height: 1.6;margin-bottom: 12px;}}
                    .credentials-box {{background-color: #f0f4f8;border-radius: 8px;padding: 16px;margin: 16px 0;}}
                    .credentials-box p {{margin: 6px 0;font-size: 15px;color: #333;}}
                    .credentials-box strong {{display: inline-block;width: 100px;}}
                    .support {{font-size: 13px;color: #555;margin-top: 20px;}}
                    .support a {{color: #1a73e8;text-decoration: none;}}
                    .footer {{font-size: 12px;text-align: center;color: #999;padding: 16px;}}
                    @media only screen and (max-width: 480px) {{.content {{ padding: 16px; }}.credentials-box strong {{ width: 90px; }}}}
                </style>
            </head>
            <body style="background-color: #f0f4f8 !important;">
                <div class="email-container">

                    <!-- HEADER IMAGE -->
                    <div class="header-image">
                    <img src="https://sis.sriramachandradigilearn.edu.in/assets/logo.png" alt="Sri Ramachandra Digilearn">
                    </div>

                    <!-- CONTENT -->
                    <div class="content">
                    <h1>Welcome, {fullname}</h1>
                    <p>Your official Sri Ramachandra Digilearn email ID has been created. Please find your credentials below:</p>

                    <!-- CREDENTIALS BOX -->
                    <div class="credentials-box">
                        <p>{email_to}</p>
                        <p><strong>Password:</strong>{password}</p>
                    </div>

                    <p>You can access your Gmail account through the Gmail website or mobile app.</p> 
                    <p>This email ID will be used for official communication, including:</p>
                    <ul style="font-size:14px; color:#444; line-height:1.5; padding-left:20px;">
                        <li>Receiving important announcements and updates</li>
                        <li>Communicating with faculty and staff</li>
                    </ul>

                    <div class="support">
                        For academic support, contact:
                        <br>
                        <a href="mailto:cdoesupport@sriramachandra.edu.in">cdoesupport@sriramachandra.edu.in</a> | 
                        <a href="tel:+919940490118">+91 99404 90118</a>
                    </div>
                    </div>

                    <!-- FOOTER -->
                    <div class="footer">
                    &copy; 2025 Sri Ramachandra Digilearn. All rights reserved.
                    </div>

                </div>
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