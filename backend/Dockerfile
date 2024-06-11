# backend/Dockerfile

# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install Flask
RUN pip install flask flask-cors psycopg2-binary

# Make port 5000 available to the world outside this container
EXPOSE 5000


CMD ["python", "app.py"]