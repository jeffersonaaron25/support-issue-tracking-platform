from nylas import Client
from nylas.models.auth import URLForAuthenticationConfig, CodeExchangeRequest
import requests
import utils
import llm
from bs4 import BeautifulSoup
from email_reply_parser import EmailReplyParser
from session import request
import os

NYLAS_CLIENT_ID = os.getenv("NYLAS_CLIENT_ID")
NYLAS_API_KEY = os.getenv("NYLAS_API_KEY")
NYLAS_API_URI = os.getenv("NYLAS_API_URI")

nylas = Client(
    api_key = NYLAS_API_KEY,
    api_uri = NYLAS_API_URI,
)

async def get_oauth_url():
    # https://developer.nylas.com/docs/v3/auth
    config = URLForAuthenticationConfig({"client_id": NYLAS_CLIENT_ID, 
        "redirect_uri" : "http://localhost:8000/oauth/exchange"})
    url = nylas.auth.url_for_oauth2(config)
    return url

async def authorize(code):
    # https://developer.nylas.com/docs/v3/auth
    exchangeRequest = CodeExchangeRequest({
        "redirect_uri": "http://localhost:8000/oauth/exchange",
        "code": code,
        "client_id": NYLAS_CLIENT_ID,
    })

    exchange = nylas.auth.exchange_code_for_token(exchangeRequest)
    return exchange.grant_id, exchange.email

async def clean_html(html, reply=False):
    soup = BeautifulSoup(html, "html.parser")
    if reply:
        # Getting rid of blockquotes in replies
        for blockquote in soup.find_all('blockquote'):
            blockquote.decompose()

    text = soup.get_text('\n')

    if reply:
        # Parsing out the reply text
        text = EmailReplyParser.parse_reply(text)

    return text

async def process_message(message_data, ticket_id=None, thread_id=None):
    ticket_data_parsed = {
        'sender': message_data.from_[0]['email'],
        'message_id': message_data.id,
        'message_created_at': message_data.created_at,
        'original_message': await clean_html(message_data.body, True if ticket_id else False),
        'thread_id': thread_id,
    }
    if ticket_id:
        ticket_data_parsed['ticket_id'] = ticket_id
    else:
        if request.session.get('processed_messages') is None:
            request.session['processed_messages'] = {}
        if request.session['processed_messages'].get(message_data.id, False) is False:
            ticket_info, status = llm.get_ticket_info(ticket_data_parsed['original_message'], message_data.subject)
            # Storing metadata on processed messages to avoid duplicate processing
            if status:
                # Store if status is True, denoting successful processing
                print('Storing processed message...')
                request.session['processed_messages'][message_data.id] = ticket_info
                print(request.session['processed_messages'])
        else:
            ticket_info = request.session['processed_messages'][message_data.id]
        if ticket_info:
            ticket_info['reported_by'] = ticket_data_parsed['sender']
            ticket = utils.create_ticket(ticket_info, thread_id, message_data.created_at)
            ticket_data_parsed['ticket_id'] = ticket['id']
    if 'ticket_id' in ticket_data_parsed:
        print('Creating message...')
        utils.create_message(ticket_data_parsed)

async def process_thread(thread, grant_id):
    # Check if the thread has an associated ticket
    ticket_id, updated_at = utils.check_ticket_exists(thread.id)
    messages = [nylas.messages.find(grant_id, message_id)[0] for message_id in thread.message_ids]

    for message_data in messages:
        # if ticket exists and message is newer than the last update, add message to ticket
        if ticket_id and updated_at < thread.latest_message_received_date and message_data.subject == "Re:" and not utils.check_message_exists(message_data.id):
            await process_message(message_data, ticket_id, thread.id)
        # if ticket does not exist, process the message and create a ticket
        elif not ticket_id and message_data.subject != "Re:":
            await process_message(message_data, None, thread.id)

async def fetch_emails_and_process():
    response = requests.get('http://api:8000/oauth/verify')
    if response.status_code == 200:
        try:
            grant_id = response.json().get('grant_id', None)
        except:
            grant_id = None
        if grant_id:
            query_params = {"limit": 5}
            threads, _, _ = nylas.threads.list(grant_id, query_params)
            for thread in threads:
                await process_thread(thread, grant_id)

async def send_email(email, grant_id):
    """
    Simple send email functionality.
    TO DO: Reply to a specific message_id
    """
    body = {
        "subject" : email["subject"],
        "body": email["body"],
        "to": [email['to']],
    }
    message = nylas.messages.send(grant_id, request_body = body).data
    return message