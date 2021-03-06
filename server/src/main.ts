import { json } from "body-parser";
import express from "express";
import Redis from "ioredis";

import { MessagePublisher, UserMessageListener } from "./publisher";
import { allowOrigin, log } from "./util";

const REDIS_HOST = process.env["REDIS_HOST"]
if (!REDIS_HOST)
    process.exit(1);

const app = express();
app.use(json());
app.use(allowOrigin);

const publisher = MessagePublisher.start(new Redis({ host: REDIS_HOST }), new Redis({ host: REDIS_HOST }));

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.get("/messages/:roomId", (req, res) => {
    const { roomId } = req.params as { roomId: string };

    log("MESSAGES_START", { roomId });

    res.writeHead(200, {
        "Content-Type": "text/event-stream; charset=utf-8",
        Connection: "keep-alive",
    });
    res.flushHeaders();

    const listener: UserMessageListener = (event) => res.write(`data: ${JSON.stringify(event)}\n\n`);
    publisher.addListener(roomId, listener);

    res.on("close", () => {
        log("CLOSE", { roomId });
        publisher.removeListener(roomId, listener);
    });
});

app.post("/messages/:roomId", async (req, res) => {
    const { roomId } = req.params as { roomId: string };
    const body: UserMessageRequest = { roomId, ...req.body };

    log("MESSAGE_POST", { body });
    await publisher.publish({ ...body, created: new Date().toISOString() });
    res.status(200).end();
});

app.listen(8080);
