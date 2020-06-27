import React from "react";
import "./App.css";
import {
  BrowserRouter,
  Route,
  Switch,
} from "react-router-dom";
import { Home } from "./Home";
import { Room } from "./Room";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/room/:roomId/:username/:server" exact>
          <Room />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
