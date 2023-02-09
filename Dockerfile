FROM node:19

WORKDIR /usr/src/agenda-beach

COPY ./package.json .

RUN npm install --only=prod

COPY ./dist ./dist

EXPOSE 3000

CMD npm run start