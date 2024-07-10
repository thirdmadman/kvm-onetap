import {readConfig} from '../utils/readConfig';
import {jnlpFileGeneratorCS1708i} from './jnlpFileGeneratorCS1708i';
import {jnlpFileGeneratorCS1708iv2} from './jnlpFileGeneratorCS1708iv2';
import {jnlpFileGeneratorCN8000A} from './jnlpFileGeneratorCN8000A';

const TYPE_TO_GENERATOR_MAP = [
  {type: 'CS1708i', func: jnlpFileGeneratorCS1708i},
  {type: 'CS1708iv2', func: jnlpFileGeneratorCS1708iv2},
  {type: 'CN8000A', func: jnlpFileGeneratorCN8000A}
];

export async function generateJnlpFile(name: string) {
  const config = await readConfig();

  if (!config) {
    throw new Error(`No KVM config found.`);
  }

  const kvmConfig = config.kvmList.find((kvmConfig) => kvmConfig.name === name);

  if (!kvmConfig) {
    throw new Error(`No KVM config found for ${name}`);
  }

  const jnlpGenerator = TYPE_TO_GENERATOR_MAP.find((generatorObject) => generatorObject.type === kvmConfig.type);

  if (!jnlpGenerator) {
    throw new Error(`No JNLP generator found for ${kvmConfig.type}`);
  }

  return jnlpGenerator.func(kvmConfig);
}
