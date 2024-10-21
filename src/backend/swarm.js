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
    this.onSwarmPeerConnected((swarmPeer) => cb(toPeer(swarmPeer)));
  }

  onSwarmPeerConnected(cb) {
    this.swarm.on("connection", cb);
  }

  onPeerData(cb) {
    this.onSwarmPeerConnected((swarmPeer) => {
      swarmPeer.on("data", (data) =>
        cb(toPeer(swarmPeer), data.toString("utf8"))
      );
    });
  }

  onPeerError(cb) {
    this.onSwarmPeerConnected((swarmPeer) => {
      swarmPeer.on("error", (error) => cb(toPeer(swarmPeer), error));
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

  sendAll(message, predicate = () => true) {
    const data = b4a.from(message, "utf8");
    for (const peer of this.swarm.connections) {
      if (predicate(peer)) {
        peer.write(data);
      }
    }
  }

  send(to, message) {
    this.sendAll(message, (peer) => toPeer(peer).pubKey === to);
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
  return getBufferFromHex(topic).length == 32;
}

function getBufferFromHex(hex) {
  return b4a.from(hex, "hex");
}

export function toPeer(hyperswarmPeer) {
  return {
    pubKey: hyperswarmPeer.remotePublicKey.toString("hex"),
  };
}
