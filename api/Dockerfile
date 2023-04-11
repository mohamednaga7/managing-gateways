FROM node:alpine

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 4004

CMD [ "yarn", "start" ]
