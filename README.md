# Genius Bot

Bot using the Genius API to get lyrics that can complete messages.
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
    labels:
      - 'traefik.enable=true'
      - 'traefik.http.routers.genius-bot.rule=Host(`${SERVER_URL}`)'
      - 'traefik.http.routers.genius-bot.entrypoints=https'

networks:
  default:
    name: public
    external: true
```
