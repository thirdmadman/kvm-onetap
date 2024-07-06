import {createDirectory} from '../utils/createDirectory.js';
import {writeStringToFile} from '../utils/writeStringToFile.js';
import path from 'path';

const getUrlId = async (domain, isHttps) => {
  const url = `http${isHttps && 's'}://${domain}/`;

  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

  try {
    const response = await fetch(url, {redirect: 'manual'});
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 1;

    const body = await response.text();

    const urlIdStart = body.indexOf('" + "/');

    if (urlIdStart <= 0) {
      console.error('Incorrect response form from server, redirect link not found.');
      return null;
    }

    const urlIdStartEnd = body.indexOf('";', urlIdStart);

    const urlId = body.substring(urlIdStart + 6, urlIdStartEnd);

    return urlId;
  } catch (e) {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 1;
    console.error(e);
    return null;
  }
};

const getTargetId = async (domain, isHttps, urlId) => {
  const url = `http${isHttps && 's'}://${domain}/${urlId}`;
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

  try {
    const response = await fetch(url, {redirect: 'manual'});
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 1;

    const body = await response.text();

    const targetIdStart = body.indexOf('name="KVMIP_TARGETID" value="');

    if (targetIdStart <= 0) {
      console.error('Incorrect response form from server, redirect link not found.');
      return null;
    }

    const targetIdStartEnd = body.indexOf('">', targetIdStart);

    const targetId = body.substring(targetIdStart + 29, targetIdStartEnd);

    return targetId;
  } catch (e) {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 1;
    console.error(e);
    return null;
  }
};

const getAuthCookie = async ({domain, isHttps, username, password, targetId, urlId}) => {
  const convert = (strSource) => {
    let strTarget = new String();
    for (let i = 0; i < strSource.length; i++) {
      if (strSource.charAt(i) == '-') {
        strTarget += '--';
      } else if ('"' == strSource.charAt(i)) {
        strTarget += '-0';
      } else if ('|' == strSource.charAt(i)) {
        strTarget += '-1';
      } else if ('#' == strSource.charAt(i)) {
        strTarget += '-2';
      } else if (' ' == strSource.charAt(i)) {
        strTarget += '-3';
      } else if ('*' == strSource.charAt(i)) {
        strTarget += '-4';
      } else if ('&' == strSource.charAt(i)) {
        strTarget += '-5';
      } else if ('+' == strSource.charAt(i)) {
        strTarget += '-6';
      } else if ('%' == strSource.charAt(i)) {
        strTarget += '-7';
      } else {
        strTarget += strSource.charAt(i);
      }
    }
    return strTarget;
  };

  const loginString =
    convert(username) +
    ' ' +
    convert(password) +
    ' ' +
    convert(domain) +
    ' ' +
    convert(targetId);

  const authData = {
    KVMIP_GMTIME: Date.now() / 1000,
    KVMIP_DIFFTIME: -(new Date()).getTimezoneOffset(),
    KVMIP_LOGIN: loginString,
    KVMIP_TARGETID: targetId,
  };

  const url = `http${isHttps && 's'}://${domain}/${urlId}`;

  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

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
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 1;

    const cookie = response.headers.get('set-cookie');

    if (!cookie || cookie.length === 0) {
      return null;
    }

    if (!cookie || cookie.length === 0 || !cookie.includes('sid=') || !cookie.includes('domain=')) {
      return null;
    }

    return cookie;
  } catch (e) {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 1;
    console.error(e);
    return null;
  }
};

const updateInquery = async (domain, isHttps, authCookie) => {
  const sessionId = authCookie.split(' domain')[0].replace('sid=', '');

  const data = {
    '/Inquery?update': 31, // unknown
    'com_common': '0108', // port
    xid: Math.random(), // unknown
    SID: sessionId,
  };

  const url = `http${isHttps && 's'}://${domain}/Inquery`;

  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Cookie': authCookie,
      },
      body: new URLSearchParams(data),
      redirect: 'manual',
    });
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 1;
    return response.text();
  } catch (e) {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 1;
    console.error(e);
    return null;
  }
};

const getFileString = async ({domain, isHttps, username, password}) => {
  const urlId = await getUrlId(domain, isHttps);
  const targetId = await getTargetId(domain, isHttps, urlId);
  const authCookie = await getAuthCookie({domain, isHttps, username, password, targetId, urlId});
  updateInquery(domain, isHttps, authCookie);

  const url = `http${isHttps && 's'}://${domain}/Inquery.jnlp`;

  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Cookie': authCookie,
        'Referer': `http${isHttps && 's'}://${domain}/${urlId}`,
      },
    });
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 1;

    const text = await response.text();

    if (!text || text.length === 0) {
      return null;
    }

    return text;
  } catch (e) {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 1;
    console.error(e);
    return null;
  }
};

export async function jnlpFileGeneratorCS1708iv2(kvmConfig) {
  if (!kvmConfig) {
    return null;
  }

  let fileContent = '';

  try {
    fileContent = await getFileString(kvmConfig);
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
