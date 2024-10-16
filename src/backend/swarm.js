import Hyperswarm from "hyperswarm";
import crypto from "hypercore-crypto";
import b4a from "b4a";

export class Swarm {
  constructor(deps = { Hyperswarm, Pear }) {
    this.swarm = new deps.Hyperswarm();
    deps.Pear.teardown(() => this.swarm.destroy());
  }

  onConnectionsUpdate(cb) {
    this.swarm.on("update", () => cb(this.swarm.connections));
  }

  onPeerConnected(cb) {
    this.swarm.on("connection", cb);
  }

  onPeerData(cb) {
    this.onPeerConnected((peer) => {
      peer.on("data", (data) => cb(peer, data));
    });
  }

  onPeerError(cb) {
    this.onPeerConnected((peer) => {
      peer.on("error", (error) => cb(peer, error));
    });
  }

  async join(topic) {
    const topicBuffer = topicToBuffer(topic);
    const discovery = this.swarm.join(topicBuffer, {
      client: true,
      server: true,
    });
    await discovery.flushed();
  }

  sendAll(message) {
    const data = b4a.from(message, "utf8");
    for (const peer of this.swarm.connections) {
      peer.write(data);
    }
  }
}

export function createTopic() {
  return crypto.randomBytes(32).toString("hex");
}

function topicToBuffer(topicString) {
  if (!isValidTopic(topicString)) {
    throw Error("invalid hex length, resulting buffer should be size of 32");
  }
  return getBufferFromHex(topicString);
}

export function isValidTopic(topic) {
  return getBufferFromHex(topic).length == 32
}

function getBufferFromHex(hex) {
  return b4a.from(hex, "hex")
}