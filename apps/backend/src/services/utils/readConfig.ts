import { IConfig } from '@/types/interfaces/IConfig';
import {readFile} from '@services/utils/readFile';
import path from 'path';

export async function readConfig() {
  try {
    const fileContent = await readFile(path.join(process.cwd(), 'config.json'));
    if (!fileContent) {
      console.error('No config file provided');
      return null;
    }

    const configObject = await JSON.parse(fileContent as string);

    if (!configObject || !configObject.kvmList || configObject.kvmList.length === 0) {
      console.error('No KVMs provided in config file or file empty.');
      return null;
    }

    return configObject as IConfig;
  } catch (e) {
    console.error(e);
    return null;
  }
}
