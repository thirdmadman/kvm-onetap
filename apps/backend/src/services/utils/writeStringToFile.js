import fs from 'fs';

export async function writeStringToFile(filePath, content) {
  const writeStream = fs.createWriteStream(filePath, { flags: 'w' });
  return new Promise((resolve, reject) => {
    writeStream.write(content, 'utf8', () => {
      writeStream.end();
    });
    writeStream.on('finish', () => resolve());
    writeStream.on('error', reject);
  });
} 