import express from "express";
import { RandomIntEmitter } from "./emitter";

const app = express();
const emitter = new RandomIntEmitter();

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.get("/messages", (req, res) => {
    console.log({ event: "MESSAGES_START" });

    req.socket.setTimeout(30 * 1000);
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
    });

    const listener = (value: number) => res.write(`data: ${JSON.stringify(value)}\n\n`);
    emitter.addListener(listener)
    res.on("close", () => {
        console.log({ event: "CLOSE" });
        emitter.removeListener(listener);
    });
});

app.listen(8080);
