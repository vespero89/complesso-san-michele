FROM python:3.11-slim

WORKDIR /app

# Dipendenze prima del codice (sfrutta la cache Docker)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Codice applicazione
COPY . .

# Directory per il database SQLite (montata come volume)
RUN mkdir -p /app/data

# Utente non-root per sicurezza
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 5000

CMD ["gunicorn", "--workers", "2", "--bind", "0.0.0.0:5000", "--access-logfile", "-", "--error-logfile", "-", "app:app"]
