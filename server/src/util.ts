import { RequestHandler } from "express";

export const allowOrigin: RequestHandler = (request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
};

export function log(event: string, data: unknown): void {
    console.log(JSON.stringify({ event, data, timestamp: new Date().toISOString() }));
}
