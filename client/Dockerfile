FROM node:14.15.0-alpine
WORKDIR /src
COPY package.json .
RUN yarn install
COPY . .