const schema = {
  type: 'object',
  required: ['API_PORT', 'API_PREFIX'],
  properties: {
    API_PORT: {
      type: 'number',
      default: 5000,
    },
    API_PREFIX: {
      type: 'string',
      default: 'api',
    }
  },
};

export interface IEnvs {
  API_PORT: number,
  API_PREFIX: string
}

export const configOptions = {
  confKey: 'config',
  schema: schema,
  data: process.env,
  dotenv: true,
  removeAdditional: true,
};
