import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import { Chat } from "../Chat";
import { Swarm } from "../../../types/swarm-types";
import { createTopic as originalCreateTopic } from "../../../backend/swarm";

function renderChat({
  swarm = new SwarmMock(),
  createTopic = originalCreateTopic,
}: { swarm?: Swarm; createTopic?: () => string } = {}) {
  render(<Chat swarm={swarm} createTopic={createTopic} />);
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
});

async function clickStartChat() {
  return userEvent.click(screen.getByText("Start Chat"));
}

async function clickJoinChat() {
  return userEvent.click(screen.getByText("Join Chat"));
}

class SwarmMock implements Swarm {
  join = jest.fn().mockResolvedValue(undefined);
  sendAll = jest.fn();
}
