FROM node:alpine

WORKDIR /app

EXPOSE 3000

COPY package* ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]