FROM node:16-alpine as build
ARG BUILD_CONTEXT
WORKDIR /app
RUN yarn global add nodemon concurrently tsc
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
EXPOSE 3000
CMD ["yarn", "dev"]
