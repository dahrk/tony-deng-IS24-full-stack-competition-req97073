FROM node:16-alpine as build
ARG BUILD_CONTEXT
WORKDIR /app
RUN yarn global add nodemon concurrently
COPY package.json .
RUN yarn install
COPY . .
EXPOSE 3000
CMD ["yarn", "dev"]
