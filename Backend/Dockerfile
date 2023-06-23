# TODO: Check if node version OK
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 2000

CMD ["node", "index.js"]
