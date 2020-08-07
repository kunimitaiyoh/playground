FROM node:12

RUN mkdir -p /opt/playground
WORKDIR /opt/playground

RUN mkdir server
COPY server/package.json server/package-lock.json server/

WORKDIR /opt/playground/server
RUN npm install

COPY server .
RUN npm run build

CMD ["node", "."]
