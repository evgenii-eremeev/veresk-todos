import { writeFile, readFile, access } from "fs/promises";
import { constants } from "fs";
import { resolve } from "path";
import { Persist as PersistType } from "../types/persist-types";

export class Persist implements PersistType {
  async set(key: string, value: string) {
    return writeFile(this.getFilePath(key), value, { flag: "w+" });
  }
  async get(key: string) {
    const path = this.getFilePath(key);
    if (await exists(path)) {
      return await readFile(this.getFilePath(key), "utf-8");
    } else {
      return "";
    }
  }

  async getParsed<T>(key: string, fallback: T): Promise<T> {
    return this.get(key)
      .then((str) => tryJsonParse(str, fallback))
      .catch((err) =>
        logErrorOr(`Getting "${key}" from persistance`, err, fallback)
      );
  }
  private getFilePath(key: string) {
    return resolve(Pear.config.storage, `./${key}.json`);
  }
}

async function exists(path: string): Promise<boolean> {
  return access(path, constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

function tryJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function logErrorOr<T>(message: string, error: any, fallback: T): T {
  console.error(message, error);
  return fallback;
}
