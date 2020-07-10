import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

const SERVER_HOST = "//localhost:8080";

export function Room() {
  const params: Params = useParams();
  const [state, setState] = useState<State>({ text: "", messages: [] });

  const roomId = decodeURIComponent(params.roomId);
  const username = decodeURIComponent(params.username);

  useEffect(() => {
    const eventSource = new EventSource(`${SERVER_HOST}/messages`);
    eventSource.onmessage = (event) => handleMessageReceive(JSON.parse(event.data));
    return () => {
      eventSource.close();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await doSubmit();
  }

  async function handleKeySubmit(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.keyCode !== 13 || !(e.ctrlKey || e.metaKey))
      return

    e.preventDefault();
    await doSubmit();
  }

  async function doSubmit(): Promise<void> {
    setState(state => ({
      ...state,
      text: "",
    }))
    await fetch(`${SERVER_HOST}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId,
        username,
        body: state.text,
      }),
    });
  }

  function handleMessageReceive(event: Message): void {
    setState(state => ({
      ...state,
      messages: state.messages.concat(event),
    }));
  }

  return (
    <Container className="route-container">
      <Row>
        <Col>
          <h1>{ roomId } - チャットルーム</h1>
          <div style={ { marginBottom: "0.5rem" } }>
            <strong>{ username }</strong>として <code>{ roomId }</code> に入室しています。
          </div>
          <Form onSubmit={ handleSubmit }>
            <Form.Control as="textarea" required value={ state.text } onChange={ e => setState({ ...state, text: e.target.value }) } onKeyDown={ handleKeySubmit } />
            <Button variant="primary" type="submit" disabled={ !state.text } style={ { marginTop: "0.6rem" } }>送信</Button>
          </Form>
          <hr/>
          <div>
            { state.messages.map((message, i) => <UserMessage message={ message } key={ i } />) }
          </div>
        </Col>
      </Row>
    </Container>
  );
};

function UserMessage(params: UserMessageParams) {
  const { username, body } = params.message;
  const created = new Date(params.message.created);
  const time = ("0" + created.getHours()).slice(-2) + ":" + ("0" + created.getMinutes()).slice(-2) + ":" + ("0" + created.getSeconds()).slice(-2)

  return (
    <div>
      <div>
        <div>
          <strong>{ username }</strong> <time dateTime={ params.message.created }>{ time }</time>
        </div>
        <p>{ body }</p>
      </div>
    </div>
  );
}

interface Params {
  roomId: string;
  username: string;
}

interface State {
  text: string;

  messages: Message[];
}

interface UserMessageParams {
  message: Message;
}

interface Message {
  username: string;
  body: string;
  created: string;
}
