import fs from 'fs';

export async function writeStringToFile(filePath: string, content: string) {
  const writeStream = fs.createWriteStream(filePath, { flags: 'w' });
  return new Promise((resolve, reject) => {
    writeStream.write(content, 'utf8', () => {
      writeStream.end();
    });
    writeStream.on('finish', () => resolve(true));
    writeStream.on('error', reject);
  });
} 