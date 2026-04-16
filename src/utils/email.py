from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from src.core.config import settings
from pathlib import Path
from typing import Optional
import uuid
import logging

# -------------------------------------------------
# Logger setup
# -------------------------------------------------
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent.parent
logo_path = BASE_DIR / "assets" / "image" / "logo.png"

# -------------------------------------------------
# SMTP Configuration
# -------------------------------------------------
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
    SUPPRESS_SEND=False,
)


# -------------------------------------------------
# Common headers generator (improves deliverability)
# -------------------------------------------------

def get_default_headers():
    return {
        "Reply-To": settings.MAIL_FROM,
        "List-Unsubscribe": f"<mailto:{settings.MAIL_FROM}>",
        "X-Mailer": "FastAPI-Mail",
        "Message-ID": f"<{uuid.uuid4()}@{settings.MAIL_FROM.split('@')[-1]}>",
    }


# -------------------------------------------------
# Generic send helper
# -------------------------------------------------

async def send_email(
    email_to: str,
    subject: str,
    html_body: str,
    plain_body: Optional[str] = None,
):
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        body=html_body,
        subtype="html",
        alternative_body=plain_body,
        headers=get_default_headers(),
    )

    fm = FastMail(conf)

    try:
        await fm.send_message(message)
        logger.info(f"Email sent successfully to {email_to}")
    except Exception as e:
        logger.error(f"Email send failed for {email_to}: {e}")


# -------------------------------------------------
# Simple Email
# -------------------------------------------------

async def send_simple_email(
    email_to: str,
    subject: str,
    html_body: str,
    plain_body: Optional[str] = None,
):
    await send_email(email_to, subject, html_body, plain_body)


# -------------------------------------------------
# Grievance Email
# -------------------------------------------------

async def send_grievance_email(
    email_to: str,
    action: str,
    grievance_id: int,
    subject_line: str,
    student_name: Optional[str],
    attachment_url: Optional[str],
):

    title_map = {
        "created": "New Grievance Added",
        "updated": "Grievance Updated",
        "deleted": "Grievance Deleted",
    }

    title = title_map.get(action, "Grievance Notice")

    link_block = (
        f'<a href="{attachment_url}">Download attachment</a>'
        if attachment_url
        else "No attachment provided"
    )

    student_label = student_name or "Student name not available"

    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 20px auto; padding: 16px; border: 1px solid #e6e9f0; border-radius: 8px;">
        <h2 style="margin: 0 0 12px 0; color: #183f8c;">{title}</h2>
        <p>A grievance has been processed.</p>
        <ul>
            <li><strong>Grievance ID:</strong> {grievance_id}</li>
            <li><strong>Student:</strong> {student_label}</li>
            <li><strong>Attachment:</strong> {link_block}</li>
        </ul>
        <p style="font-size: 12px; color: #666;">
            Support: {settings.MAIL_FROM}
        </p>
    </div>
    """

    plain_body = f"""
{title}

Grievance ID: {grievance_id}
Student: {student_label}
Attachment: {attachment_url or 'No attachment'}
Support: {settings.MAIL_FROM}
"""

    await send_email(
        email_to,
        subject=f"[SIS] {title} - #{grievance_id}",
        html_body=html_body,
        plain_body=plain_body,
    )


# -------------------------------------------------
# Credentials Email (SECURE VERSION)
# -------------------------------------------------

async def send_credentials_email(
    email_to: str,
    username: str,
    fullname: str,
    reset_link: str,
):
    """
    IMPORTANT SECURITY CHANGE:
    Password is NOT sent in email.
    User must set password using secure reset link.
    """

    subject = "Set Your Password - Student Information System"

    plain_text = f"""
Dear {fullname},

Your SIS portal account has been created.

Username: {username}

Please click the link below to set your password:
{reset_link}

This link is valid for 24 hours.

If you did not request this account, please contact support.

Support: {settings.MAIL_FROM}
"""

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif;">

        <div style="max-width: 640px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">

            <h2>Hello {fullname},</h2>

            <p>Your SIS portal account has been created.</p>

            <div style="background: #f0f4f8; padding: 15px; border-radius: 6px;">
                <strong>Username:</strong> {username}
            </div>

            <p>Please click the button below to set your password:</p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="{reset_link}" 
                   style="background-color: #1a73e8; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                   Set Your Password
                </a>
            </div>

            <p style="font-size: 12px; color: #666;">
                This link will expire in 24 hours.
            </p>

            <hr>

            <p style="font-size: 12px; color: #999;">
                Support: {settings.MAIL_FROM}
            </p>

        </div>

    </body>
    </html>
    """

    await send_email(
        email_to,
        subject=subject,
        html_body=html_body,
        plain_body=plain_text,
    )


# -------------------------------------------------
# Password Reset Email
# -------------------------------------------------

async def send_reset_email(email_to: str, reset_link: str):

    subject = "Password Reset Request - SIS"

    plain_text = f"""
We received a request to reset your password.

Reset your password using the link below:
{reset_link}

This link is valid for 24 hours.

If you did not request this, ignore this email.
"""

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif;">

        <div style="max-width: 640px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">

            <h2>Password Reset Request</h2>

            <p>Click the button below to reset your password:</p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="{reset_link}" 
                   style="background-color: #1a73e8; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                   Reset Password
                </a>
            </div>

            <p style="font-size: 12px; color: #666;">
                This link will expire in 24 hours.
            </p>

        </div>

    </body>
    </html>
    """

    await send_email(
        email_to,
        subject=subject,
        html_body=html_body,
        plain_body=plain_text,
    )
