import React, { useEffect, useState } from "react";
import { Swarm } from "../../types/swarm-types";
import { isValidTopic } from "../../backend/swarm";
import { Message } from "../../types/communication-types";

interface Props {
  swarm: Swarm;
  createTopic: () => string;
}

export function Chat({ swarm, createTopic }: Props) {
  const [topic, setTopic] = useState<string | null>(null);
  const [peerCount, setPeerCount] = useState(0);
  const [messages, setMessages] = useState<Array<Message>>([]);

  useEffect(() => {
    swarm.onConnectionsUpdate((connections) => {
      setPeerCount(connections.size);
    });

    swarm.onPeerData((peer, data) => {
      addMessage(data, peer.pubKey.slice(0, 4));
    });
  }, []);

  function addMessage(text: string, from: string) {
    setMessages((messages) => [...messages, { text, from }]);
  }

  return (
    <div>
      {!topic ? (
        <StartPanel
          onTopic={async (topic) => {
            await swarm.join(topic);
            setTopic(topic);
          }}
          createTopic={createTopic}
        />
      ) : (
        <>
          <p>{topic}</p>
          <p>Peers: {peerCount}</p>
          <div>
            {messages.map((message, idx) => (
              <p key={message.text + idx}>
                {`${message.from}: ${message.text}`}
              </p>
            ))}
          </div>
          <MessageEditor
            onSubmit={(message) => {
              setMessages((messages) => [
                ...messages,
                { text: message, from: "me" },
              ]);
              swarm.sendAll(message);
            }}
          />
        </>
      )}
    </div>
  );
}

function StartPanel({
  onTopic,
  createTopic,
}: {
  onTopic: (topic: string) => void;
  createTopic: () => string;
}) {
  const [showTopicForm, setShowTopicForm] = useState(false);

  return (
    <div>
      <button
        onClick={async () => {
          onTopic(createTopic());
        }}
      >
        Start Chat
      </button>
      <button onClick={() => setShowTopicForm(true)}>Join Chat</button>
      {showTopicForm && <TopicEditor onSubmit={onTopic} />}
    </div>
  );
}

function TopicEditor({ onSubmit }: { onSubmit: (topic: string) => void }) {
  const [topicDraft, setTopicDraft] = useState("");
  const [topicError, setTopicError] = useState("");

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        if (!isValidTopic(topicDraft)) {
          setTopicError("invalid topic");
        } else {
          onSubmit(topicDraft);
        }
      }}
    >
      <label htmlFor="topic-input">Topic</label>
      <input
        id="topic-input"
        autoFocus
        value={topicDraft}
        onChange={(event) => {
          setTopicDraft(event.target.value);
        }}
      />
      {Boolean(topicError) && <p>{topicError}</p>}
    </form>
  );
}

function MessageEditor({ onSubmit }: { onSubmit: (message: string) => void }) {
  const [message, setMessage] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(message);
        setMessage("");
      }}
    >
      <label htmlFor="message-input">Message</label>
      <input
        id="message-input"
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
    </form>
  );
}
