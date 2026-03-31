from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from src.core.config import settings
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent  # goes from utils → src → SisHub
logo_path = BASE_DIR / "assets" / "image" / "logo.png"

# Global SMTP config (from .env)
# Improved configuration for better email deliverability
conf = ConnectionConfig(
   MAIL_USERNAME=settings.MAIL_USERNAME,
   MAIL_PASSWORD=settings.MAIL_PASSWORD,
   MAIL_PORT=587,
   MAIL_SERVER=settings.MAIL_SERVER,
   MAIL_STARTTLS=True,
   MAIL_SSL_TLS=False,
   USE_CREDENTIALS=True,
   MAIL_FROM=settings.MAIL_FROM,
   MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
   SUPPRESS_SEND=False  # Ensure emails are actually sent
)

async def send_credentials_email(email_to: str, username: str, password: str, fullname: str):
    """
    Send async credentials email to the new user with improved deliverability.
    """
    subject = "Your Student Information System Portal Login Credentials"
    
    # Plain text version (important for spam filters)
    plain_text = f"""
Dear {fullname},

Your SIS portal login credentials are as follows:

Username: {username}
Password: {password}

Please use https://sis.sriramachandradigilearn.edu.in/ to sign in and view your details.

Please keep your login credentials safe and secure. If you have any issues accessing the portal, feel free to reach out to us.

For academic support, contact:
cdoesupport@sriramachandra.edu.in | +91 90439 53673

© 2025 Sri Ramachandra Digilearn. All rights reserved.
    """
    
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
                    .credentials-box {{background-color: #f0f4f8;border-radius: 8px;padding: 16px;margin: 16px 0;border-left: 4px solid #1a73e8;}}
                    .credentials-box p {{margin: 6px 0;font-size: 15px;color: #333;}}
                    .credentials-box strong {{display: inline-block;width: 100px;}}
                    .support {{font-size: 13px;color: #555;margin-top: 20px;}}
                    .support a {{color: #1a73e8;text-decoration: none;}}
                    .footer {{font-size: 12px;text-align: center;color: #999;padding: 16px;border-top: 1px solid #eee;}}
                    @media only screen and (max-width: 480px) {{.content {{ padding: 16px; }}.credentials-box strong {{ width: 90px; }}}}
                </style>
            </head>
            <body style="background-color: #f0f4f8 !important;">
                <div class="email-container">

                    <!-- HEADER IMAGE -->
                    <div class="header-image">
                    <img src="https://sis.sriramachandradigilearn.edu.in/assets/logo2.png" alt="Sri Ramachandra Digilearn">
                    </div>

                    <!-- CONTENT -->
                    <div class="content">
                    <h1>Dear {fullname},</h1>
                    <p>Your SIS portal login credentials are as follows:</p>

                    <!-- CREDENTIALS BOX -->
                    <div class="credentials-box">
                        <p><strong>Username:</strong> {username}</p>
                        <p><strong>Password:</strong> {password}</p>
                    </div>

                    <p>Please use <a href="https://sis.sriramachandradigilearn.edu.in/" style="color: #1a73e8; text-decoration: none;">https://sis.sriramachandradigilearn.edu.in/</a> to sign in and view your details.</p>

                    <p>Please keep your login credentials safe and secure. If you have any issues accessing the portal, feel free to reach out to us.</p>

                    <div class="support">
                        For academic support, contact:<br>
                        <a href="mailto:cdoesupport@sriramachandra.edu.in">cdoesupport@sriramachandra.edu.in</a> | 
                        <a href="tel:+919043953673">+91 90439 53673</a>
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
    
    # Create message with proper headers and HTML for better deliverability
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        body=html_body,
        subtype="html",
        headers={
            "X-Priority": "3",
            "X-MSMail-Priority": "Normal",
            "Importance": "Normal",
            "X-Mailer": "FastAPI-Mail/3.1",
            "MIME-Version": "1.0",
            "Content-Transfer-Encoding": "8bit",
            "List-Unsubscribe": "<mailto:cdoesupport@sriramachandra.edu.in>, <https://sis.sriramachandradigilearn.edu.in/unsubscribe>",
            "X-Originating-IP": "[127.0.0.1]"
        }
    )
    
    fm = FastMail(conf)
    try:
        await fm.send_message(message)
    except Exception as e:
        # Log error (use your logger here, e.g., logger.error(f"Email failed for {email_to}: {e}"))
        print(f"Email send failed for {email_to}: {e}")  # Fallback for demo

async def send_reset_email(email_to: str, reset_link: str):
    """
    Send password reset email with improved deliverability.
    """
    subject = "Password Reset Request - Sri Ramachandra Digilearn SIS"
    
    # Plain text version (important for spam filters)
    plain_text = f"""
Dear User,

We received a request to reset your password for your Sri Ramachandra Digilearn SIS account.

Click the link below to reset your password:
{reset_link}

This link is valid for 24 hours. If you did not request a password reset, please ignore this email or contact our support team immediately.

For security reasons, never share this link with anyone.

For academic support, contact:
cdoesupport@sriramachandra.edu.in | +91 99404 90118

© 2025 Sri Ramachandra Digilearn. All rights reserved.
    """
    
    html_body = f"""
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Sri Ramachandra Digilearn - Password Reset</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {{margin: 20px !important;padding: 0;font-family: Arial, Helvetica, sans-serif;}}
                    .email-container {{max-width: 640px;margin: 0 auto;background-color: #ffffff;box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;border-radius: 1%;}}
                    .header-image img {{width: 100%;display: block;}}
                    .content {{padding: 24px;}}
                    .content h1 {{font-size: 22px;font-weight: bold;color: #222;margin-bottom: 16px;}}
                    .content p {{font-size: 14px;color: #444;line-height: 1.6;margin-bottom: 12px;}}
                    .button-container {{text-align: center;margin: 30px 0;}}
                    .reset-button {{display: inline-block;background-color: #1a73e8;color: white;padding: 12px 30px;text-decoration: none;border-radius: 4px;font-weight: bold;}}
                    .reset-button:hover {{background-color: #1664c4;}}
                    .link-text {{word-break: break-all;color: #1a73e8;font-size: 12px;}}
                    .warning {{background-color: #fff3cd;border-left: 4px solid #ffc107;padding: 12px;margin: 16px 0;border-radius: 4px;font-size: 13px;color: #856404;}}
                    .support {{font-size: 13px;color: #555;margin-top: 20px;}}
                    .support a {{color: #1a73e8;text-decoration: none;}}
                    .footer {{font-size: 12px;text-align: center;color: #999;padding: 16px;border-top: 1px solid #eee;}}
                    @media only screen and (max-width: 480px) {{.content {{ padding: 16px; }}.reset-button {{ padding: 10px 20px; }}}}
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
                    <h1>Password Reset Request</h1>
                    <p>We received a request to reset your password for your Sri Ramachandra Digilearn SIS account.</p>

                    <!-- RESET BUTTON -->
                    <div class="button-container">
                        <a href="{reset_link}" class="reset-button">Reset Your Password</a>
                    </div>

                    <p style="text-align: center; font-size: 12px; color: #666;">Or copy and paste this link in your browser:</p>
                    <p class="link-text" style="text-align: center; word-break: break-all;">{reset_link}</p>

                    <!-- WARNING BOX -->
                    <div class="warning">
                        <strong>Important:</strong> This link is valid for 24 hours. If you did not request this password reset, please ignore this email or contact our support team immediately.
                    </div>

                    <p style="font-size: 13px; color: #666;"><strong>For security reasons:</strong> Never share this link with anyone. Sri Ramachandra Digilearn support will never ask for your password.</p>

                    <div class="support">
                        For academic support, contact:<br>
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
    
    # Create message with proper headers and HTML for better deliverability
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        body=html_body,
        subtype="html",
        headers={
            "X-Priority": "3",
            "X-MSMail-Priority": "Normal",
            "Importance": "Normal",
            "X-Mailer": "FastAPI-Mail/3.1",
            "MIME-Version": "1.0",
            "Content-Transfer-Encoding": "8bit",
            "List-Unsubscribe": "<mailto:cdoesupport@sriramachandra.edu.in>, <https://sis.sriramachandradigilearn.edu.in/unsubscribe>",
            "X-Originating-IP": "[127.0.0.1]"
        }
    )
    
    fm = FastMail(conf)
    try:
        await fm.send_message(message)
    except Exception as e:
        # Log error (use your logger here, e.g., logger.error(f"Email failed for {email_to}: {e}"))
        print(f"Email send failed for {email_to}: {e}")  # Fallback for demo