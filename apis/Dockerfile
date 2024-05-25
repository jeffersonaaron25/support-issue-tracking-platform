FROM python:3.8-slim-buster

WORKDIR /app

ADD . /app

RUN apt-get update \
    && apt-get -y install libpq-dev gcc
# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000
