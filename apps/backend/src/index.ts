import 'module-alias/register';
import fastify, {FastifyServerOptions} from 'fastify';
import autoload from '@fastify/autoload';
import {join} from 'path';

const port = parseInt((process.env.API_PORT), 10) || 5000;

const startServer = async (opts?: FastifyServerOptions) => {
  try {
    const defaultOptions = {
      logger: true,
    };

    const server = fastify({...defaultOptions, ...opts});

    server.register(autoload, {
      dir: join(__dirname, 'routes'),
      options: {prefix: '/api'},
    });

    await server.listen({port});
  } catch (e) {
    console.error(e);
  }
};

process.on('unhandledRejection', (e) => {
  console.error(e);
  process.exit(1);
});

startServer();
