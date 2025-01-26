# Use a base image that already has FFmpeg installed
FROM jrottenberg/ffmpeg:5.0-alpine

# Install Python and dependencies
RUN apk add --no-cache python3 py3-pip

# Set the working directory for your app
WORKDIR /app

# Copy your application code into the container
COPY . /app

# Install the necessary Python packages from requirements.txt
RUN pip install -r requirements.txt

# Expose the port your Flask app runs on (default is 5000)
EXPOSE 5000

# Set the default command to run your Flask app
CMD ["python3", "app.py"]