import {readConfig} from './readConfig';

export async function findConfigByName(name: string) {
  const config = await readConfig();

  if (!config) {
    return null;
  }

  const kvmConfig = config.kvmList.find((kvmConfig) => kvmConfig.name === name) || null;

  return kvmConfig;
}
