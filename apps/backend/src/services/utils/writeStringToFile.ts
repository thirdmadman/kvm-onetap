import fs from 'fs';

export async function writeStringToFile(filePath: string, content: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath, { flags: 'w' });

    writeStream.on('error', (err) => {
      reject(err);
    });

    writeStream.on('finish', () => {
      resolve();
    });

    writeStream.write(content, 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        writeStream.end();
      }
    });
  });
}