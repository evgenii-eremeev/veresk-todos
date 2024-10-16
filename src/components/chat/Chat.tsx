import React, { useEffect, useState } from "react";
import { Swarm } from "../../types/swarm-types";
import { isValidTopic } from "../../backend/swarm";

interface Props {
  swarm: Swarm;
  createTopic: () => string;
}

export function Chat({ swarm, createTopic }: Props) {
  const [topic, setTopic] = useState<string | null>(null);
  const [peerCount, setPeerCount] = useState(0);

  useEffect(() => {
    swarm.onConnectionsUpdate(connections => {
      setPeerCount(connections.length)
    })
  }, [])

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
          <MessageEditor onSubmit={(message) => swarm.sendAll(message)} />
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
