# Backend Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app.py helpers.py db.py pokemon_db.json ./

# Expose port
EXPOSE 8080

# Set environment variables
ENV FLASK_PORT=8080
ENV FLASK_DEBUG=false

# Run the application
CMD ["python", "app.py"]
