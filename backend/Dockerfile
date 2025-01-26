# Use a Python base image and install FFmpeg
FROM python:3.9-slim

# Install FFmpeg and system dependencies
RUN apt-get update && apt-get install -y ffmpeg && apt-get clean

# Set the working directory for your app
WORKDIR /app

# Copy your application code into the container
COPY . /app

# Install the necessary Python packages from requirements.txt
RUN pip install -r requirements.txt

# Expose the port your Flask app runs on (default is 5000)
EXPOSE 8080

# Set the default command to run your Flask app
CMD ["python3", "app.py"]