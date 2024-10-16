import { render, screen, cleanup, act } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import { Chat } from "../Chat";
import { Peer, Swarm } from "../../../types/swarm-types";
import { createTopic as originalCreateTopic } from "../../../backend/swarm";
import { SwarmModelProvider } from "../../../model/SwarmModel";
import { SwarmMock } from "../../../utils/testing";

function renderChat({
  swarm = new SwarmMock(),
  createTopic = originalCreateTopic,
}: { swarm?: Swarm; createTopic?: () => string } = {}) {
  render(
    <SwarmModelProvider swarm={swarm} createTopic={createTopic}>
      <Chat />
    </SwarmModelProvider>
  );
}

describe("Chat", () => {
  it("should have start chat button", async () => {
    renderChat();
    expect(screen.queryByText("Start Chat")).toBeTruthy();
  });

  it("should create topic after start chat", async () => {
    for (const expectedTopic of ["topic-1", "topic-2"]) {
      await test(expectedTopic);
    }

    async function test(expectedTopic: string) {
      renderChat({ createTopic: () => expectedTopic });
      await clickStartChat();
      await screen.findByText(expectedTopic);
      cleanup();
    }
  });

  it("should hide start chat and join chat buttons after click", async () => {
    renderChat();
    await clickStartChat();
    expect(screen.queryByText("Start Chat")).toBeNull();
    expect(screen.queryByText("Join Chat")).toBeNull();
  });

  it("should join new chat after start chat clicked", async () => {
    const swarm = new SwarmMock();
    const topic = "topic";
    renderChat({ swarm, createTopic: () => topic });
    await clickStartChat();

    expect(swarm.join).toHaveBeenCalledWith(topic);
  });

  it("should render join chat button", async () => {
    renderChat();
    expect(screen.queryByText("Join Chat")).toBeTruthy();
  });

  it("should render chat message input after joining the swarm", async () => {
    renderChat();
    await clickStartChat();
    screen.getByLabelText("Message");
  });

  it("should call sendAll after submitting the message", async () => {
    const swarm = new SwarmMock();
    renderChat({ swarm });
    expect(screen.queryByLabelText("Message")).toBeNull();
    await clickStartChat();
    await userEvent.click(screen.getByLabelText("Message"));
    await userEvent.keyboard("msg{Enter}");
    expect(swarm.sendAll).toHaveBeenCalledWith("msg");
  });

  it("should clear message input after send", async () => {
    renderChat();
    await clickStartChat();
    const input: HTMLInputElement = screen.getByLabelText("Message");
    await userEvent.click(input);
    await userEvent.type(input, "msg");
    await userEvent.click(await screen.findByText("Send"));
    expect(input.value).toBe("");
  });

  it("should display message after sending it", async () => {
    renderChat();
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
    renderChat({ swarm });
    await clickStartChat();
    act(() => {
      swarm.simulatePeerData({ pubKey: "abcdef" }, "received message 1");
    });
    screen.getByText("abcd: received message 1");
  });

  it("should show input after Join Chat click", async () => {
    renderChat();
    expect(screen.queryByLabelText("Topic")).toBeNull();
    await clickJoinChat();
    expect(screen.queryByLabelText("Topic")).not.toBeNull();
  });

  it("should validate topic", async () => {
    renderChat();
    await clickJoinChat();
    expect(screen.queryByText("invalid topic")).toBeNull();
    await userEvent.keyboard(`${"z".repeat(64)}{Enter}`);
    screen.getByText("invalid topic");
  });

  it("should set topic if user provided a valid one", async () => {
    renderChat();
    await clickJoinChat();
    const topic = "f".repeat(64);
    await userEvent.keyboard(`${topic}{Enter}`);
    expect(screen.queryByText("invalid topic")).toBeNull();
    screen.getByText(topic);
  });

  it("should join the topic in Join Chat flow", async () => {
    const swarm = new SwarmMock();
    renderChat({ swarm });
    await clickJoinChat();
    const topic = "f".repeat(64);
    await userEvent.keyboard(`${topic}{Enter}`);
    expect(swarm.join).toHaveBeenCalledWith(topic);
  });

  it("should join by clicking Join button in Join Chat flow", async () => {
    const swarm = new SwarmMock();
    renderChat({ swarm });
    await clickJoinChat();
    const topic = "f".repeat(64);
    await userEvent.type(screen.getByLabelText("Topic"), topic);
    await userEvent.click(screen.getByText("Join"));
    expect(swarm.join).toHaveBeenCalledWith(topic);
  });

  it("should show peers count 0 after creating chat", async () => {
    renderChat();
    await clickStartChat();
    await screen.findByText("Peers: 0");
  });

  it("should show right peers count after someone joins", async () => {
    const swarm = new SwarmMock();
    renderChat({ swarm });
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

