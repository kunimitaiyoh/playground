# playground

A demo for realtime web application using Server-Sent Events.

## Instllation

Node.js is required.

If Yarn is not installed, install it globally as follows:

```
npm install -g yarn
```

In `server` folder, do:

```bash
npm install
```

In `web` folder, do:

```bash
yarn
```

## Run

In the project root, do as follows to start Docker Compose:

```
docker-compose up
```

Ctrl-C to down.

In `server` folder, do as follows to start the server:

```bash
npm run up
```

In `web` folder, do as follows to start the website:

```bash
yarn start
```

Then open http://localhost:3000 in your browser to test the application.

