import React from "react";
import { useParams } from "react-router-dom";

export function Room() {
    const params: Params = useParams();
    return (
      <div>
        <h1>Room</h1>
        <div>
          roomId: { decodeURIComponent(params.roomId) }
          <br />
          username: { decodeURIComponent(params.username) }
          <br/>
          server: { params.server }
        </div>
      </div>
    );

};

interface Params {
  roomId: string;
  username: string;
  server: string;
}
