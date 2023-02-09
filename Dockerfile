FROM node:19

WORKDIR /usr/src/agenda-beach

COPY ./package.json .

RUN npm install --only=prod