import React from "react";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <div>
      <h1>Home</h1>
      <div>
        <Link to="/room/general/ラジオ/elemental">Room</Link>
      </div>
    </div>
  );
};
