import { render, screen, cleanup, act } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import { Peer, Swarm } from "../../../types/swarm-types";
import { createTopic as originalCreateTopic } from "../../../backend/swarm";
import { CreateTopic, SwarmModelProvider } from "../../../model/useSwarm";
import { addProjects, PersistMock, SwarmMock } from "../../../utils/testing";
import { Projects } from "../../projects/Projects";
import { Persist } from "../../../types/persist-types";

async function renderChat({
  persist = new PersistMock(),
  createTopic = originalCreateTopic,
  swarm = new SwarmMock(),
}: {
  persist?: Persist;
  createTopic?: CreateTopic;
  swarm?: Swarm;
} = {}) {
  render(
    <Projects persist={persist} swarm={swarm} createTopic={createTopic} />
  );
  await addProjects(["Test chat project"]);
}

describe("Chat", () => {
  it("should have start chat button", async () => {
    await renderChat();
    expect(screen.queryByText("Start Chat")).toBeTruthy();
  });

  it("should hide start chat and join chat buttons after click", async () => {
    await renderChat();
    await clickStartChat();
    expect(screen.queryByText("Start Chat")).toBeNull();
    expect(screen.queryByText("Join Chat")).toBeNull();
  });

  it("should join new chat after start chat clicked", async () => {
    const swarm = new SwarmMock();
    const topic = "topic";
    await renderChat({ swarm, createTopic: () => topic });
    await clickStartChat();

    expect(swarm.join).toHaveBeenCalledWith(topic);
  });

  it("should render join chat button", async () => {
    await renderChat();
    expect(screen.queryByText("Join Chat")).toBeTruthy();
  });

  it("should render chat message input after joining the swarm", async () => {
    await renderChat();
    await clickStartChat();
    screen.getByLabelText("Message");
  });

  it("should call sendAll after submitting the message", async () => {
    const swarm = new SwarmMock();
    await renderChat({ swarm });
    expect(screen.queryByLabelText("Message")).toBeNull();
    await clickStartChat();
    await userEvent.click(screen.getByLabelText("Message"));
    await userEvent.keyboard("msg{Enter}");
    expect(swarm.sendAll).toHaveBeenCalledWith(
      JSON.stringify({ type: "chat-message", payload: "msg" })
    );
  });

  it("should clear message input after send", async () => {
    await renderChat();
    await clickStartChat();
    const input: HTMLInputElement = screen.getByLabelText("Message");
    await userEvent.click(input);
    await userEvent.type(input, "msg");
    await userEvent.click(await screen.findByText("Send"));
    expect(input.value).toBe("");
  });

  it("should display message after sending it", async () => {
    await renderChat();
    await clickStartChat();
    await userEvent.click(screen.getByLabelText("Message"));
    const messages = ["foo", "bar", "baz"];
    for (const message of messages) {
      await userEvent.keyboard(`${message}{Enter}`);
      screen.getByText(`me: ${message}`);
    }
  });

  it("should display message after receiving it", async () => {
    const swarm = new SwarmMock();
    await renderChat({ swarm });
    await clickStartChat();
    act(() => {
      swarm.simulatePeerData(
        { pubKey: "abcdef" },
        JSON.stringify({ type: "chat-message", payload: "received message 1" })
      );
    });
    screen.getByText("abcd: received message 1");
  });

  it("should show input after Join Chat click", async () => {
    await renderChat();
    expect(screen.queryByLabelText("Topic")).toBeNull();
    await clickJoinChat();
    expect(screen.queryByLabelText("Topic")).not.toBeNull();
  });

  it("should validate topic", async () => {
    await renderChat();
    await clickJoinChat();
    expect(screen.queryByText("invalid topic")).toBeNull();
    await userEvent.keyboard(`${"z".repeat(64)}{Enter}`);
    screen.getByText("invalid topic");
  });

  it("should join the topic in Join Chat flow", async () => {
    const swarm = new SwarmMock();
    await renderChat({ swarm });
    await clickJoinChat();
    const topic = "f".repeat(64);
    await userEvent.keyboard(`${topic}{Enter}`);
    expect(swarm.join).toHaveBeenCalledWith(topic);
  });

  it("should join by clicking Join button in Join Chat flow", async () => {
    const swarm = new SwarmMock();
    await renderChat({ swarm });
    await clickJoinChat();
    const topic = "f".repeat(64);
    await userEvent.type(screen.getByLabelText("Topic"), topic);
    await userEvent.click(screen.getByText("Join"));
    expect(swarm.join).toHaveBeenCalledWith(topic);
  });

  it("should show peers count 0 after creating chat", async () => {
    await renderChat();
    await clickStartChat();
    await screen.findByText("Peers: 0");
  });

  it("should show right peers count after someone joins", async () => {
    const swarm = new SwarmMock();
    await renderChat({ swarm });
    await clickStartChat();

    const peers = [{}, {}, {}] as Array<Peer>;
    for (let i = 0; i < peers.length; i++) {
      act(() => {
        swarm.simulatePeerConnection(peers[i]);
      });
      await screen.findByText(`Peers: ${i + 1}`);
    }
  });
});

async function clickStartChat() {
  return userEvent.click(screen.getByText("Start Chat"));
}

async function clickJoinChat() {
  return userEvent.click(screen.getByText("Join Chat"));
}

async function clickJoinProjectChat() {
  return userEvent.click(screen.getByText("Join project chat"));
}
