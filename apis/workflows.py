from datetime import timedelta
from temporalio import workflow
from temporalio.client import Client
from temporalio.worker import Worker
from temporalio import activity
with workflow.unsafe.imports_passed_through():
    import email_parser
    import utils

@workflow.defn
class FetchEmailsWorkflow:
    @workflow.run
    async def run(self) -> None:
        await workflow.execute_activity(fetch_emails, schedule_to_close_timeout=timedelta(minutes=2))

@workflow.defn
class FetchPendingTicketsWorkflow:
    @workflow.run
    async def run(self) -> None:
        await workflow.execute_activity(fetch_active_tickets, schedule_to_close_timeout=timedelta(minutes=2))

@activity.defn
async def fetch_emails() -> None:
    # Logic to fetch emails and update tickets
    print("Fetching emails...")
    await email_parser.fetch_emails_and_process()

@activity.defn
async def fetch_active_tickets() -> None:
    # Logic to fetch active tickets
    print("Fetching active tickets...")
    data = utils.get_active_tickets()
    utils.log_pending_tickets(len(data))

async def main():
    client = await Client.connect("temporal:7233")
    worker = Worker(
        client,
        task_queue="ticket-task-queue",
        workflows=[FetchEmailsWorkflow, FetchPendingTicketsWorkflow],
        activities=[fetch_emails, fetch_active_tickets],
    )
    await worker.run()

if __name__ == "__main__":
    print("STARTING WORKER...")
    import asyncio
    asyncio.run(main())
