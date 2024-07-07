import 'module-alias/register';
import {fastify, FastifyServerOptions} from 'fastify';
import { rootRoutes } from '@routes/root';

const port = parseInt(process.env.API_PORT || '0', 10) || 5000;

const startServer = async (opts?: FastifyServerOptions) => {
  try {
    const defaultOptions = {
      logger: true,
    };

    const server = fastify({...defaultOptions, ...opts});

    server.get("/healthcheck", async function () {
      return { status: "OK" };
    });

    server.register(rootRoutes, { prefix: "api" });

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
