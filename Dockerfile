FROM node:lts-hydrogen

WORKDIR /app

COPY . .
RUN yarn
RUN yarn build

CMD ["node", "./dist/main.js"]
