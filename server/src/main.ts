import { json } from "body-parser";
import express from "express";
import Redis from "ioredis";

import { MessagePublisher, UserMessageListener } from "./publisher";
import { allowOrigin } from "./util";

const app = express();
app.use(json());
app.use(allowOrigin);

const publisher = MessagePublisher.start(new Redis(), new Redis());

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.get("/messages/:roomId", (req, res) => {
    const { roomId } = req.params as { roomId: string };

    console.log({ event: "MESSAGES_START", data: { roomId } });

    res.writeHead(200, {
        "Content-Type": "text/event-stream; charset=utf-8",
        Connection: "keep-alive",
    });
    res.flushHeaders();

    const listener: UserMessageListener = (event) => res.write(`data: ${JSON.stringify(event)}\n\n`);
    publisher.addListener(roomId, listener);

    res.on("close", () => {
        console.log({ event: "CLOSE" });
        publisher.removeListener(roomId, listener);
    });
});

app.post("/messages/:roomId", async (req, res) => {
    const { roomId } = req.params as { roomId: string };
    const body: UserMessageRequest = { roomId, ...req.body };

    console.log({ event: "MESSAGE_POST", body });
    await publisher.publish({ ...body, created: new Date().toISOString() });
    res.status(200).end();
});

app.listen(8080);
