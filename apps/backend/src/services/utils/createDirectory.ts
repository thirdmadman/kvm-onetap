import fs from 'fs';

export async function createDirectory(path: string) {
  fs.mkdirSync(path, {recursive: true});
}
