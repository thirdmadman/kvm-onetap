import {fastifyEnv} from '@fastify/env';
import 'module-alias/register';
import {fastify, FastifyServerOptions} from 'fastify';
import {rootRoutes} from '@routes/root';
import cors from '@fastify/cors';
import {configOptions, IEnvs} from './plugins/env';

const startServer = async (opts?: FastifyServerOptions) => {
  try {
    const defaultOptions = {
      logger: true,
    };

    const server = fastify({...defaultOptions, ...opts});
    server.register(cors, {});
    server.register(fastifyEnv, configOptions);
    await server.after();

    const envs = server.getEnvs<IEnvs>();

    server.get('/healthcheck', async function () {
      return {status: 'OK'};
    });

    server.register(rootRoutes, {prefix: envs.API_PREFIX});


    (async () => {
      try {
        await server.ready();
        await server.listen({port: envs.API_PORT});
      } catch (error) {
        server.log.error(error);
        process.exit(1);
      }
    })();
  } catch (e) {
    console.error(e);
  }
};

process.on('unhandledRejection', (e) => {
  console.error(e);
  process.exit(1);
});

startServer();
