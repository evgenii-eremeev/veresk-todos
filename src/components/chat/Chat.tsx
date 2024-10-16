import React, { useState } from "react";
import { Swarm } from "../../types/swarm-types";
import { isValidTopic } from "../../backend/swarm";

interface Props {
  swarm: Swarm;
  createTopic: () => string;
}

export function Chat({ swarm, createTopic }: Props) {
  const [topic, setTopic] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [showTopicFrom, setShowTopicForm] = useState(false);
  const [topicDraft, setTopicDraft] = useState("");
  const [topicError, setTopicError] = useState("");

  return (
    <>
      {!topic && (
        <>
          <button
            onClick={async () => {
              const topic = createTopic();
              await swarm.join(topic);
              setTopic(topic);
            }}
          >
            Start Chat
          </button>
          <button onClick={() => setShowTopicForm(true)}>Join Chat</button>
          {showTopicFrom && (
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                if (!isValidTopic(topicDraft)) {
                  setTopicError("invalid topic");
                } else {
                  await swarm.join(topicDraft);
                  setTopic(topicDraft);
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
          )}
        </>
      )}
      <p>{topic}</p>
      {topic && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            swarm.sendAll(message);
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
      )}
    </>
  );
}
