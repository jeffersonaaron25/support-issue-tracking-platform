# main.py
from fastapi import FastAPI, HTTPException, status
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import utils
import email_parser
from models import *
from session import request

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/tickets")
async def read_tickets():
    tickets = utils.read_tickets()
    return {"status": "success", "data": tickets}

@app.post("/tickets")
async def create_ticket(ticket: Ticket):
    utils.create_ticket(ticket.model_dump())
    return {"status": "success", "data": ticket}

@app.put("/tickets/{ticket_id}")
async def update_ticket(ticket_id: int, ticket: Ticket):
    ticket = utils.update_ticket(ticket_id, ticket.model_dump())
    if ticket:
        return {"status": "success", "data": ticket}
    return {"status": "error", "error": "Ticket not found"}

@app.get("/tickets/{ticket_id}")
async def get_ticket(ticket_id: int):
    ticket = utils.get_ticket(ticket_id)
    if ticket:
        return {"status": "success", "data": ticket}
    return {"status": "error", "error": "Ticket not found"}

@app.delete("/tickets/{ticket_id}")
async def delete_ticket(ticket_id: int):
    status = utils.delete_ticket(ticket_id)
    if status:
        return {"status": "success"}
    return {"status": "error", "error": "Ticket not found"}

@app.get("/tickets/all/active")
async def get_active_tickets():
    tickets = utils.get_active_tickets()
    return {"status": "success", "data": tickets}

@app.get("/tickets/{ticket_id}/messages")
async def get_ticket_messages(ticket_id: int):
    messages = utils.get_ticket_messages(ticket_id)
    return {"status": "success", "data": messages}

@app.post("/tickets/{ticket_id}/message/create")
async def create_ticket_message(ticket_id: int, message: Message):
    data = await email_parser.send_email(message.model_dump(), grant_id=request.session.get("grant_id"))
    print(data)
    utils.create_ticket_message(data, ticket_id)
    return {"status": "success"}

@app.get("/tickets/all/status_history")
async def get_ticket_status_history():
    history = utils.get_status_history()
    return {"status": "success", "data": history}

@app.get("/oauth/url")
async def get_oauth_url():
    url = await email_parser.get_oauth_url()
    return {"status": "success", "url": url}

@app.get("/oauth/exchange")
async def authorized(code: str):
    if request.session.get("grant_id") is None:
        grant_id, email = await email_parser.authorize(code)
        request.session["grant_id"] = grant_id
        request.session["user_email"] = email
        request.session['processed_emails'] = {}
    return RedirectResponse("http://localhost:5173", status_code=status.HTTP_303_SEE_OTHER)

@app.get('/oauth/verify')
async def verify_oauth():
    if request.session.get("grant_id", None) is None or request.session.get("user_email", None) is None:
        return HTTPException(status_code=401, detail="Not authorized")
    
    return {"status": "success", 'email': request.session.get("user_email"), 'grant_id': request.session.get("grant_id")}

@app.get("/logout")
async def logout():
    request.session['grant_id'] = None
    request.session['user_email'] = None
    return RedirectResponse("http://localhost:5173", status_code=status.HTTP_303_SEE_OTHER)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app)

