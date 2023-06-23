FROM node:16 AS prod

WORKDIR /app

ARG SERVER_CONNECTION

ENV SERVER_CONNECTION $SERVER_CONNECTION

ARG SERVER_PORT

ENV SERVER_PORT $SERVER_PORT

COPY package*.json ./

RUN npm install

COPY . .



RUN npm run build

CMD ["npm", "run", "dev"]