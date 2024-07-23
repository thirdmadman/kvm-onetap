import {IKvmConfig} from '@/types/interfaces/IConfig';
import {getTemplateByType} from '../templates/getTemplateByType';
import {createDirectory} from '../utils/createDirectory';
import {writeStringToFile} from '../utils/writeStringToFile';
import path from 'path';
import tls from 'tls';

const getFormattedCurrentTimestamp = () => {
  const now = new Date();
  return `${now.getFullYear()}.${now.getMonth()}.${now.getDate()}.${now.getHours()}.${now.getMinutes()}.${now.getSeconds()}`;
};

const getCookies = async ({
  domain,
  isHttps,
  username,
  password,
}: {
  domain: string;
  isHttps: boolean;
  username: string;
  password: string;
}) => {
  const authData = {
    username,
    password,
    curtime: getFormattedCurrentTimestamp(),
  };

  const url = `http${isHttps && 's'}://${domain}/view.htm`;

  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
  tls.DEFAULT_MIN_VERSION = 'TLSv1';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
      },
      body: new URLSearchParams(authData),
      redirect: 'manual',
    });
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';

    const html = await response.text();
    const cutStart = html.indexOf('window.top.keyname="');
    const cutEnd = html.indexOf('";document.cookie = ');
    const cookies = html.substring(cutStart + 20, cutEnd);

    return cookies;
  } catch (e) {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';
    tls.DEFAULT_MIN_VERSION = 'TLSv1.2';
    console.error(e);
    return null;
  }
};

const getPage = async ({domain, isHttps, cookies} : {domain: string; isHttps: boolean; cookies: string}) => {

  const cutStart = cookies.indexOf(';global_sessionpid=\'');
  const cutEnd = cookies.indexOf('\';global_directrun=0');
  const pid = cookies.substring(cutStart + 20, cutEnd);
  console.error(pid);

  const port = isHttps ? '443' : '80';
  const https = isHttps ? '1'  : '0';
  const cmdId = 'auto';

  const command = `launchclient.htm?cmd_id=${cmdId}&pid=${pid}&host=${domain}&port=${port}&https=${https}`;

  const url = `http${isHttps && 's'}://${domain}/${command}`;

  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
  tls.DEFAULT_MIN_VERSION = 'TLSv1';
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        cookies: cookies,
      },
    });
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';

    const html = await response.text();
    console.error(html);

  } catch (e) {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';
    tls.DEFAULT_MIN_VERSION = 'TLSv1.2';
    console.error(e);
    return null;
  }
};

export async function jnlpFileGeneratorCN8000(kvmConfig: IKvmConfig) {
  if (!kvmConfig) {
    return null;
  }

  let fileContent = '';

  const {domain, isHttps, port, appPort, modelSecret, jarFilePath} = kvmConfig;

  try {
    const cookies = await getCookies(kvmConfig);
    if (!cookies) {
      return null;
    }

    console.error(cookies);

    await getPage({domain, isHttps, cookies});
    console.error(cookies);
    const cutStart = cookies.indexOf(";global_sessionpid='");
    const cutEnd = cookies.indexOf("';global_directrun=0");
    const pid = cookies.substring(cutStart + 20, cutEnd);
    console.error(pid);

    const template = getTemplateByType(kvmConfig.type);
    fileContent = template(domain, isHttps, String(port), pid, String(appPort), modelSecret, jarFilePath);
  } catch (e) {
    console.error(e);
    return;
  }

  try {
    const fileName = `${kvmConfig.name}_${Date.now()}.jnlp`;
    const pathToFile = path.join(process.cwd(), `./tmp/${fileName}`);
    await createDirectory(path.join(process.cwd(), `./tmp/`));
    await writeStringToFile(pathToFile, fileContent);

    return pathToFile;
  } catch (e) {
    console.error(e);
    return;
  }
}
