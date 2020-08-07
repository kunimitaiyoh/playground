FROM node:12

RUN mkdir -p /opt/playground
WORKDIR /opt/playground

RUN mkdir server
COPY server/package.json server
RUN yarn --cwd server

COPY server server
RUN yarn --cwd server build

WORKDIR /opt/playground/server
