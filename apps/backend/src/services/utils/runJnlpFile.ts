import { promisify } from "util";
import { exec } from "child_process";

const execPromise = promisify(exec);

export const runJnlpFile = async (jnlpFile: string) => {
  await execPromise(`"C:\\Program Files\\Java\\jre1.8.0_321\\bin\\javaws.exe" "${jnlpFile}"`);
};
