import os
from mailersend import MailerSendClient, EmailBuilder
from dotenv import load_dotenv
from jinja2 import Environment, FileSystemLoader

script_dir = os.path.dirname(os.path.abspath(__file__))

load_dotenv(os.path.join(script_dir, ".mail.env"))

MAILERSEND_API_KEY = os.getenv("MAILERSEND_API_KEY")

if MAILERSEND_API_KEY is None:
    raise ValueError("MAILERSEND_API_KEY is not set")

def send_verification_email(to_email: str, verification_token: str) -> None:
    """Send a verification email to the user."""
    template_dir = os.path.join(script_dir, 'templates')
    env = Environment(loader=FileSystemLoader(template_dir))
    template = env.get_template('verification_email.html')
    verification_url = f"http://localhost:5173/verify/{verification_token}"
    email_content = template.render(verification_url=verification_url)

    mailer = MailerSendClient(api_key=MAILERSEND_API_KEY)

    email = (EmailBuilder()
             .subject("Tourgether | Verify your E-Mail")
             .from_email("noreply@test-65qngkdoyjdlwr12.mlsender.net")
             .to(to_email)
             .html(email_content)
             .build()
            )

    response = mailer.emails.send(email)

