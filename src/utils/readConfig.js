import {readFile} from './readFile.js';
import path from 'path';

export async function readConfig() {
  try {
    const fileContent = await readFile(path.join(process.cwd(), 'config.json'));
    if (!fileContent) {
      console.error('No config file provided');
      return null;
    }

    const configObject = await JSON.parse(fileContent);

    if (!configObject || !configObject.kvmList || configObject.kvmList.length === 0) {
      console.error('No KVMs provided in config file or file empty.');
      return null;
    }

    return configObject;
  } catch (e) {
    console.error(e);
    return null;
  }
}
