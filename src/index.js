import {runJnlpFile} from './utils/runJnlpFile.js';
import {generateJnlpFile} from './file-generators/generateJnlpFile.js';


const main = async () => {
  const filename = await generateJnlpFile('kvm-g16');
  if (!filename) {
    return;
  }

  runJnlpFile(filename);
};

main();