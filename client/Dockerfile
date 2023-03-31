FROM node:16-alpine as build
ARG BUILD_CONTEXT
WORKDIR /app
ENV NODE_ENV=dev
RUN yarn global add react-scripts
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
EXPOSE 3001
CMD ["yarn", "start"]
