import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export function Home() {
  const [state, setState] = useState({ name: "", roomId: "" });
  const history = useHistory();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    history.push(`/room/${encodeURIComponent(state.roomId)}/${encodeURIComponent(state.name)}`);
    e.preventDefault();
  }

  return (
    <Container className="route-container">
      <Row>
        <Col>
          <h1>Home</h1>
          <Form onSubmit={ handleSubmit }>
            <Form.Group as={ Row } controlId="formPlaintextName">
              <Form.Label column sm="2">名前</Form.Label>
              <Col sm="4">
                <Form.Control type="text" required value={ state.name } onChange={ e => setState({ ...state, name: e.target.value }) } />
              </Col>
            </Form.Group>
            <Form.Group as={ Row } controlId="formPlaintextRoom">
              <Form.Label column sm="2">部屋</Form.Label>
              <Col sm="4">
                <Form.Control type="text" required list="datalist-room" onChange={ e => setState({ ...state, roomId: e.target.value }) } />
                <datalist id="datalist-room">
                  <option value="general" />
                  <option value="random" />
                </datalist>
              </Col>
            </Form.Group>
            <Button variant="primary" type="submit">入室</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
