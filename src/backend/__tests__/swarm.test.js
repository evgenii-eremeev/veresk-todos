import { Swarm, createTopic } from "../swarm";
import b4a from "b4a";

describe("swarm", () => {
  let Pear;
  beforeEach(() => {
    Pear = createPear();
  });

  it("should init", () => {
    const swarm = new Swarm({ Hyperswarm: HyperswarmMock, Pear });
    expect(swarm).toBeTruthy();
  });

  it("should contain Hyperswarm instance", () => {
    const swarm = new Swarm({ Hyperswarm: HyperswarmMock, Pear });
    expect(swarm.swarm).toBeInstanceOf(HyperswarmMock);
  });

  it("should destroy swarm on runtime teardown", () => {
    const swarm = new Swarm({ Hyperswarm: HyperswarmMock, Pear });
    Pear.simulateTeardown();
    expect(swarm.swarm.destroy).toHaveBeenCalled();
  });

  it("should notify on connections update", () => {
    const swarm = new Swarm({ Hyperswarm: HyperswarmMock, Pear });
    const connectionsUpdateCallback = jest.fn();
    swarm.onConnectionsUpdate(connectionsUpdateCallback);
    expect(connectionsUpdateCallback).not.toHaveBeenCalled();
    swarm.swarm.simulateEvent("update");
    expect(connectionsUpdateCallback).toHaveBeenCalled();
  });

  it("should call connections update event handler with number of connections", () => {
    const swarm = new Swarm({ Hyperswarm: HyperswarmMock, Pear });
    const connectionsUpdateCallback = jest.fn();
    swarm.onConnectionsUpdate(connectionsUpdateCallback);
    swarm.swarm.simulateEvent("update", new Set());
    expect(connectionsUpdateCallback).toHaveBeenNthCalledWith(1, new Set());
    const connections = new Set(["conn1", "conn2"]);
    swarm.swarm.simulateEvent("update", connections);
    expect(connectionsUpdateCallback).toHaveBeenNthCalledWith(2, connections);
  });

  it("should call peer connected event handler", () => {
    const swarm = new Swarm({ Hyperswarm: HyperswarmMock, Pear });
    const peerConnectedCallback = jest.fn();
    swarm.onPeerConnected(peerConnectedCallback);
    const peer1 = new PeerMock("pubkey1");
    const peer2 = new PeerMock("pubkey2");
    swarm.swarm.simulateEvent("connection", peer1);
    expect(peerConnectedCallback).toHaveBeenCalledWith(peer1);
    swarm.swarm.simulateEvent("connection", peer2);
    expect(peerConnectedCallback).toHaveBeenCalledWith(peer2);
  });

  it("should call peer data event handler", () => {
    const swarm = new Swarm({ Hyperswarm: HyperswarmMock, Pear });
    const peerDataCallback = jest.fn();
    swarm.onPeerData(peerDataCallback);
    const peer = new PeerMock("abc");
    swarm.swarm.simulateEvent("connection", peer);
    peer.simulateEvent("data", "some data");
    expect(peerDataCallback).toHaveBeenCalledWith(peer, "some data");
  });

  it("should call peer error event handler", () => {
    const swarm = new Swarm({ Hyperswarm: HyperswarmMock, Pear });
    const peerErrorCallback = jest.fn();
    swarm.onPeerError(peerErrorCallback);
    const peer = new PeerMock("abc");
    swarm.swarm.simulateEvent("connection", peer);
    peer.simulateEvent("error", "some error");
    expect(peerErrorCallback).toHaveBeenCalledWith(peer, "some error");
  });

  it("should create topic", () => {
    const topic = createTopic();
    expect(typeof topic).toBe("string");
    expect(topic).toHaveLength(64);
  });

  it("should throw error if joining swarm with invalid topic string", async () => {
    const swarm = new Swarm({ Hyperswarm: HyperswarmMock, Pear });
    const errorMessage =
      "invalid hex length, resulting buffer should be size of 32";
    await expect(swarm.join("foobar")).rejects.toEqual(Error(errorMessage));
    await expect(swarm.join("a".repeat(10))).rejects.toEqual(
      Error(errorMessage)
    );
    await expect(swarm.join("f".repeat(70))).rejects.toEqual(
      Error(errorMessage)
    );
  });
  it("should join swarm if valid topic is provided", () => {
    const swarm = new Swarm({ Hyperswarm: HyperswarmMock, Pear });
    const topic = "f".repeat(64);
    swarm.join("f".repeat(64));
    expect(swarm.swarm.join).toHaveBeenCalledWith(b4a.from(topic, "hex"), {
      client: true,
      server: true,
    });
    expect(swarm.swarm.flushed).toHaveBeenCalled();
  });
  it("should send data", () => {
    const swarm = new Swarm({ Hyperswarm: HyperswarmMock, Pear });
    const peer1 = new PeerMock("pubkey1");
    const peer2 = new PeerMock("pubkey2");
    swarm.swarm.simulateEvent("connection", peer1);
    swarm.swarm.simulateEvent("connection", peer2);
    swarm.sendAll("some data");
    const buffer = b4a.from("some data", "utf8");
    expect(peer1.write).toHaveBeenCalledWith(buffer);
    expect(peer2.write).toHaveBeenCalledWith(buffer);
  });
});

class HyperswarmMock {
  eventCallbacks = {
    update: () => {},
    connection: () => {},
  };
  connections = new Set();
  destroy = jest.fn();
  flushed = jest.fn().mockResolvedValue();
  join = jest.fn(() => ({
    flushed: this.flushed,
  }));

  on(event, cb) {
    this.eventCallbacks[event] = cb;
  }

  simulateEvent(event, payload) {
    switch (event) {
      case "update":
        this.connections = payload || new Set();
        this.eventCallbacks[event]();
        break;
      case "connection":
        this.connections.add(payload);
        this.eventCallbacks[event](payload);
        break;
    }
  }
}

function createPear() {
  let teardownCallback = () => {};
  return {
    teardown: (cb) => {
      teardownCallback = cb;
    },
    simulateTeardown: () => {
      teardownCallback();
    },
  };
}

class PeerMock {
  write = jest.fn();
  constructor(pubKey) {
    this.remotePublicKey = pubKey;
    this.eventCallbacks = {};
  }

  on(event, cb) {
    this.eventCallbacks[event] = cb;
  }

  simulateEvent(event, payload) {
    this.eventCallbacks[event](payload);
  }
}
