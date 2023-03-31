FROM node:16-alpine as build
ARG BUILD_CONTEXT
WORKDIR /app
COPY package.json .
RUN yarn install
COPY . .
EXPOSE 3001
CMD ["yarn", "start"]
