
import { IConfig, IKvmConfig } from '@/types/interfaces/IConfig';
import {getTemplateByType} from '../templates/getTemplateByType';
import {createDirectory} from '../utils/createDirectory';
import {writeStringToFile} from '../utils/writeStringToFile';
import path from 'path';

const getFormattedCurrentTimestamp = () => {
  const now = new Date();
  return `${now.getFullYear()}.${now.getMonth()}.${now.getDate()}.${now.getHours()}.${now.getMinutes()}.${now.getSeconds()}`;
};

const getApiKey = async ({domain, isHttps, username, password}: {domain: string, isHttps: boolean, username: string, password: string}) => {
  const authData = {
    page_id: 'applet.htm',
    username,
    password,
    login: 'Login',
    curtime: getFormattedCurrentTimestamp(),
  };

  const url = `http${isHttps && 's'}://${domain}/view.htm`;

  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = "0";
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br, zstd',

      },
      body: new URLSearchParams(authData),
      redirect: 'manual'
    });
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = "1";
    
    const location = response.headers.get('Location');

    if (!location || location.length === 0) {
      return null;
    }

    const apiKey = location.split('?pid=')[1];
    if (!apiKey || apiKey.length === 0) {
      return null;
    }

    return apiKey;
  } catch (e) {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = "1";
    console.error(e);
    return null;
  }
}

export async function jnlpFileGeneratorCS1708i(kvmConfig: IKvmConfig) {
  if (!kvmConfig) {
    return null;
  }

  let fileContent = '';

  const {domain, isHttps, username, password} = kvmConfig

  try {
    const apiKey = await getApiKey(kvmConfig);
    if (!apiKey) {
      return null;
    }
    const template = getTemplateByType(kvmConfig.type);
    fileContent = template(kvmConfig.domain, kvmConfig.isHttps, String(kvmConfig.port), apiKey, String(kvmConfig.appPort), kvmConfig.modelSecret, kvmConfig.jarFilePath);
  } catch (e) {
    console.error(e);
    return;
  }

  try {
    const fileName = `${kvmConfig.name}.jnlp`;
    const pathToFile = path.join(process.cwd(), `./tmp/${fileName}`);
    await createDirectory(path.join(process.cwd(), `./tmp/`));
    await writeStringToFile(pathToFile, fileContent);

    return pathToFile;
  } catch (e) {
    console.error(e);
    return;
  }
}
