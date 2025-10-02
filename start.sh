#!/bin/sh

# Pega o conteúdo da variável (que está em base64) e faz a,
# decodifica de volta para o JSON original e escreve no arquivo.
echo "$GOOGLE_CREDENTIALS_JSON" | base64 --decode > /usr/src/app/google-credentials.json

export GOOGLE_APPLICATION_CREDENTIALS="/usr/src/app/google-credentials.json"

echo "Iniciando a aplicação..."
exec npm start