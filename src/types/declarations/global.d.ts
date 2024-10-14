declare global {
  var Pear: Pear;
}

interface Pear {
  config: Config;
}
interface Config {
  storage: string;
}

export {};
