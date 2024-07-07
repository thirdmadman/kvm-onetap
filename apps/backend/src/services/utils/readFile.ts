import fs from 'fs';

export async function readFile(pathToFile: string) {
  const readStream = fs.createReadStream(pathToFile);

  const promise = new Promise((resolve) => {
    const chunks = new Array<Buffer>();
    readStream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    readStream.on('end', () => resolve(Buffer.concat(chunks).toString()));
  });
  
  return promise;
}
