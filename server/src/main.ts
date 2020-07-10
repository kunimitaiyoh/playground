import { json } from "body-parser";
import express from "express";

import { RandomIntEmitter } from "./emitter";
import { allowOrigin } from "./util";

const app = express();
app.use(json());
app.use(allowOrigin);

const emitter = new RandomIntEmitter();

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.get("/messages", (req, res) => {
    console.log({ event: "MESSAGES_START" });

    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
    });

    const listener = (value: number) => res.write(`data: ${JSON.stringify(value)}\n\n`);
    emitter.addListener(listener);

    res.on("close", () => {
        console.log({ event: "CLOSE" });
        emitter.removeListener(listener);
    });
});

app.post("/messages", (req, res) => {
    const body: UserMessageRequest = req.body
    console.log({ event: "MESSAGE_POST", body });

    res.status(200).end();
});

app.listen(8080);

interface UserMessageRequest {
    roomId: string;
    username: string;
    body: string;
}

interface UserMessage extends UserMessageRequest {
    created: string;
}
