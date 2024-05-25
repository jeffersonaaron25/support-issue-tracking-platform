import asyncio
import temporalio
from temporalio.client import Client
from workflows import FetchEmailsWorkflow, FetchPendingTicketsWorkflow

async def start_workflow_emails():
    client = await Client.connect("temporal:7233")
    await client.start_workflow(
        FetchEmailsWorkflow.run,
        id="fetch-emails-workflow-1m",
        task_queue="ticket-task-queue",
        cron_schedule="@every 1m"  # every 1 minute for testing, can be changes
    )

async def start_workflow_pending_tickets():
    client = await Client.connect("temporal:7233")
    await client.start_workflow(
        FetchPendingTicketsWorkflow.run,
        id="log-pending_tickets-workflow-1m",
        task_queue="ticket-task-queue",
        cron_schedule="@every 1m"  # every 1 minute for testing, can be changed
    )

if __name__ == "__main__":
    try:
        print("Starting workflows FetchEmailsWorkflow..")
        asyncio.run(start_workflow_emails())
    except temporalio.exceptions.WorkflowAlreadyStartedError:
        print("Workflow already started: FetchEmailsWorkflow")
    try:
        print("Starting workflow: FetchPendingTicketsWorkflow...")
        asyncio.run(start_workflow_pending_tickets())
    except temporalio.exceptions.WorkflowAlreadyStartedError:
        print("Workflow already started: FetchPendingTicketsWorkflow")