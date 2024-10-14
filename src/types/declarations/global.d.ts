declare global {
  var Pear: Pear;
}

interface Pear {
  config: Config;
  updates: (cb: () => void) => void;
  reload: () => void;
}
interface Config {
  storage: string;
}

export {};
