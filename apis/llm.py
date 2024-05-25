import json
from langchain_openai import ChatOpenAI
import os

llm = ChatOpenAI(model="gpt-4-turbo", temperature=0)


def get_ticket_info(message, subject):
    system_prompt = f"""
You are a support assistant for a ticketing system. Your job is to read incoming messages from users and create metadata for tickets.
First, you must determine if the message is either a support request or complaint. If it is not, reply with one word "FALSE".
Any sort of issue must be addressed as a ticket.
Next, you must determine the title, status, assignee, priority, and description of the ticket based on the message. Return ONLY
a dict with the following keys: "title", "status", "assignee", "priority", and "description", "original_message", no other words, new lines, etc. 
DO NOT RETURN AS A CODE BLOCK. 
If you cannot determine any of these keys, return an empty string for that key. 
Mandatory keys: "title", "status", "priority", and "description".
Assess and choose priority (High, Medium, Low) based on the urgency of the message.
original_message has been cleaned from HTML tags, so if
the text has errors in punctuation or spacing, fix it.

Subject: {subject}
Message: {message}
"""
    response = llm.invoke(system_prompt)
    print(response.content)

    if "FALSE" in response.content:
        return None, True
    try:
        dict = json.loads(response.content.replace('json', ''))
        return dict, True
    except:
        print("PARSE ERROR:",response.content)
        return None, False