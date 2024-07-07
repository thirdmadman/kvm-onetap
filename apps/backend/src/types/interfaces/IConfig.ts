export interface IKvmConfig {
  name: string;
  title: string;
  type: string;
  domain: string;
  isHttps: boolean;
  port: number;
  username: string;
  password: string;
  appPort: number;
  modelSecret: string;
  jarFilePath: string;
}

export interface IConfig {
  kvmList: Array<IKvmConfig>;
}
