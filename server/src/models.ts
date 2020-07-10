interface UserMessageRequest {
    roomId: string;
    username: string;
    body: string;
}

interface UserMessage extends UserMessageRequest {
    created: string;
}
