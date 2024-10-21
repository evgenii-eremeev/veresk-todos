import React, { useState } from "react";
import { isValidTopic } from "../../backend/swarm";
import { Button } from "../common/Button";
import { useSwarm } from "../../model/useSwarm";
import { Message } from "../../types/communication-types";

interface Props {
  onTopicCreated: (topic: string) => void;
  savedTopic: string | null;
}

export function Chat({ onTopicCreated, savedTopic }: Props) {
  const {
    topic,
    peerCount,
    createTopic,
    joinTopic,
    isJoining,
    sendAll,
    messages,
    addMessage
  } = useSwarm();
  const hasJoined = topic && topic == savedTopic;

  return (
    <div className="border-2 border-gray-600 h-64 mr-2 my-2 p-2">
      {!hasJoined ? (
        <StartPanel
          onTopic={async (topic) => {
            await joinTopic(topic);
            onTopicCreated(topic);
          }}
          createTopic={createTopic}
          isJoining={isJoining}
          savedTopic={savedTopic}
          onJoinSavedTopic={joinTopic}
        />
      ) : (
        <>
          <p>Peers: {peerCount}</p>
          <Messages messages={messages} />
          <MessageEditor onSubmit={(message) => {
            sendAll(message);
            addMessage(message, 'me')
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
  isJoining,
  savedTopic,
  onJoinSavedTopic,
}: {
  onTopic: (topic: string) => void;
  createTopic: () => string;
  isJoining: boolean;
  savedTopic: string | null;
  onJoinSavedTopic: (topic: string) => void;
}) {
  const [showTopicForm, setShowTopicForm] = useState(false);

  return (
    <div>
      {savedTopic ? (
        <Button onClick={() => onJoinSavedTopic(savedTopic)}>
          Join project chat
        </Button>
      ) : (
        <>
          <Button
            className="mx-2 disabled:border-gray-500 disabled:text-gray-500"
            onClick={async () => {
              onTopic(createTopic());
            }}
            disabled={isJoining}
          >
            Start Chat
          </Button>
          <Button
            className="disabled:border-gray-500 disabled:text-gray-500"
            onClick={() => setShowTopicForm(true)}
            disabled={isJoining}
          >
            Join Chat
          </Button>
          {showTopicForm && <TopicEditor onSubmit={onTopic} />}
        </>
      )}
    </div>
  );
}

function Messages({ messages }: { messages: Message[] }) {
  return (
    <div className="h-40 overflow-y-auto text-wrap">
      {messages.map((message, idx) => (
        <p key={message.text + idx}>{`${message.from}: ${message.text}`}</p>
      ))}
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
        className="border-2 border-black rounded-md p-1 mx-1"
        autoFocus
        value={topicDraft}
        onChange={(event) => {
          setTopicDraft(event.target.value);
        }}
      />
      <Button type="submit">Join</Button>
      {Boolean(topicError) && <p>{topicError}</p>}
    </form>
  );
}

function MessageEditor({ onSubmit }: { onSubmit: (message: string) => void }) {
  const [message, setMessage] = useState("");

  return (
    <form
      className="flex"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(message);
        setMessage("");
      }}
    >
      <label htmlFor="message-input" className="hidden">
        Message
      </label>
      <input
        className="flex-auto border-2 border-black rounded-md p-1"
        id="message-input"
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <Button type="submit" className="mx-1 text-blue-700">
        Send
      </Button>
    </form>
  );
}
