FROM python:3.12-slim

WORKDIR /app

# requirements.txt primero y en su propia capa: mientras no cambien las dependencias,
# el pip install se reutiliza de la caché aunque se toque app.py
COPY requirements.txt .

# --no-cache-dir evita que pip deje el paquete descargado dentro de la imagen
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

EXPOSE 5000

CMD ["python", "app.py"]
