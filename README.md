# Mentium Code Challenge: Support Issue Tracking Platform

This project is a code challenge for Mentium. It's a Support Issue Tracking Platform, where when users send emails to a support email address, the incoming email is fetched and linked to a new ticket or creates a thread in an existing ticket if ticket exists. The user can update the status of a ticket, assign it to a user, and change the priority of the ticket.

<img width="1423" alt="Screenshot 2024-05-24 at 8 50 40 PM" src="https://github.com/jeffersonaaron25/support-issue-tracking-platform/assets/53298971/860436ff-aae4-4386-9aaa-0800335ccdb8">


## Project Structure

The project is divided into two main parts: the API and the frontend.

- `apis/`: This directory contains the API developed in Python using FastAPI. It includes various modules like `email_parser.py`, `llm.py`, `main.py`, `models.py`, `session.py`, `start_workflow.py`, `utils.py`, and `workflows.py`.
- `webapp/`: This directory contains the frontend developed in React/TypeScript. It includes various components like `Auth.tsx`, `Messages.tsx`, `TicketModal.tsx`, `Tickets.tsx`, and `theme.tsx`.

## Tech Stack

Python,
FastAPI,
React,
TypeScript,
Docker,
Nylas API for Emails,
Temporal for Workflow Scheduling

## Dev's Note

This project was done on my graduation week in less than 30 hours to make it to my family vacation!
This means I had to make some compromises on enhancements and wanted to ensure the app is functional as
per the challenge guidelines!

<img width="615" alt="Screenshot 2024-05-24 at 9 24 41 PM" src="https://github.com/jeffersonaaron25/support-issue-tracking-platform/assets/53298971/0603bec4-6292-4cb4-8efb-5d100e4508d1">

## Functionalities

The API supports the following functionalities:

- List all tickets or active tickets
- Update a ticket (status, assignee, priority)
- List messages for a given ticket
- Send messages through email response
- Connect a user's email inbox using Nylas
- Uses LLM to create ticket from Email

The frontend displays tickets and when a ticket is clicked, it displays the corresponding thread. The user can update ticket statuses, assignee, etc. Additionally, there is also a trend chart to visualize the active tickets over a day.

## Setup and Initialization

To set up and run the project, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the `apis/` directory. Ensure .env file with your environment variables exist in the directory.
3. Start the Docker Compose with the command `docker-compose up -d`.
4. Ensure all the services are running. Occasionally, restarting might be required.
5. Navigate to the `webapp/` directory and install the required packages using the command `yarn`.
6. Start the web app with the command `yarn run dev`.

## License

[MIT](https://choosealicense.com/licenses/mit/)
