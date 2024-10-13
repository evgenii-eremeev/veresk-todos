import { writeFile } from "fs/promises";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

export class Persist implements Persist {
  set(key: string, value: string) {
    writeFile(this.getFilePath(key), value, { flag: "w+" }).catch(
      console.error
    ); // ignores promise
  }
  get(key: string) {
    const path = this.getFilePath(key);
    if (existsSync(path)) {
      return readFileSync(this.getFilePath(key), "utf-8");
    } else {
      return "";
    }
  }
  private getFilePath(key: string) {
    // @ts-ignore:next-line
    return resolve(Pear.config.storage, `./${key}.json`);
  }
}
