import fs from 'fs';

export async function createDirectory(path) {
  fs.mkdirSync(path, {recursive: true});
}
