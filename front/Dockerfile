FROM node:latest AS prod

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 1234

CMD ["npm", "run", "dev"]