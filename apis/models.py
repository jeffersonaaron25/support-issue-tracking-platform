
from pydantic import BaseModel


class Ticket(BaseModel):
    title: str
    status: str
    assignee: str
    priority: str
    description: str
    source: str
    reported_by: str

class Message(BaseModel):
    subject: str
    body: str
    to: dict