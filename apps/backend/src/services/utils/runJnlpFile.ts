import {exec} from 'child_process';

export const runJnlpFile = (jnlpFile: string) => {
  exec(`javaws -Xnosplash ${jnlpFile}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    return;
  });
};
