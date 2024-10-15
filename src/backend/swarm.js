import Hyperswarm from "hyperswarm";
import crypto from "hypercore-crypto";
import b4a from "b4a";

export class Swarm {
  constructor({ Hyperswarm, Pear } = { Hyperswarm, Pear }) {
    this.swarm = new Hyperswarm();
    Pear.teardown(() => this.swarm.destroy());
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
    const topicBuffer = Swarm.topicToBuffer(topic);
    const discovery = this.swarm.join(topicBuffer, {
      client: true,
      server: true,
    });
    await discovery.flushed();
  }

  sendAll(data) {
    for (const peer of this.swarm.connections) {
      peer.write(data);
    }
  }

  static createTopic() {
    return crypto.randomBytes(32).toString("hex");
  }

  static topicToBuffer(topicString) {
    const buffer = b4a.from(topicString, "hex");
    validateTopicBuffer(buffer);
    return buffer;
  }
}

function validateTopicBuffer(buffer) {
  if (buffer.length !== 32) {
    throw Error("invalid hex length, resulting buffer should be size of 32");
  }
}
