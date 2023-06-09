# Genius Bot

Bot that responds to messages with song lyrics obtained from the Genius API.
Currently compatible with Telegram.

## Development

1. Install dependencies

    ```sh
    yarn
    ```

2. Configuration

    Create a `.env` file or set env variables:

    ```env
    TELEGRAM_KEY=xxxxxxxxxxxxxxxx
    ARTISTS=artist1,artist2,artist3 # Optional
    ```

3. Start

    ```sh
    yarn dev
    ```

## Deployment with Docker Compose

```yml
version: '3'

services:
  genius-bot:
    image: ghcr.io/mathieu2301/genius-bot:latest
    restart: always
    environment:
      TELEGRAM_KEY: ${TELEGRAM_KEY}
```
