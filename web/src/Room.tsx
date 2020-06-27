import React from "react";
import { useParams } from "react-router-dom";

export function Room() {
    const { roomId, username, server } = useParams()
    return (
      <div>
        <h1>Room</h1>
        <div>
          roomId: { roomId }
          <br />
          username: { username }
          <br/>
          server: { server }
        </div>
      </div>
    );
};
