FROM node:alpine as build

WORKDIR /usr/app

COPY package.json .

RUN yarn install

COPY . .

RUN yarn build

FROM nginx:alpine as prod

COPY ./nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/app/dist /usr/share/nginx/html

EXPOSE 80 443