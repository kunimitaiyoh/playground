import { json } from "body-parser";
import express from "express";

import { MessageEmitter, UserMessageListener } from "./emitter";
import { allowOrigin } from "./util";

const app = express();
app.use(json());
app.use(allowOrigin);

const emitter = new MessageEmitter();

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.get("/messages", (req, res) => {
    console.log({ event: "MESSAGES_START" });

    res.writeHead(200, {
        "Content-Type": "text/event-stream; charset=utf-8",
        Connection: "keep-alive",
    });
    res.flushHeaders();

    const listener: UserMessageListener = (event) => res.write(`data: ${JSON.stringify(event)}\n\n`);
    emitter.addListener(listener);

    res.on("close", () => {
        console.log({ event: "CLOSE" });
        emitter.removeListener(listener);
    });
});

app.post("/messages", (req, res) => {
    const body: UserMessageRequest = req.body
    console.log({ event: "MESSAGE_POST", body });
    emitter.emit({ ...body, created: new Date().toISOString() });
    res.status(200).end();
});

app.listen(8080);
