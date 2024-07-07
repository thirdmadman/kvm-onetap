import {FastifyInstance, FastifyPluginOptions, FastifyPluginAsync} from 'fastify';
import fp from 'fastify-plugin';

const RootRoute: FastifyPluginAsync = async (server: FastifyInstance, options: FastifyPluginOptions) => {
  server.get('/', {}, async (request, reply) => {
    try {
      return reply.code(200).send('All good');
    } catch (error) {
      request.log.error(error);
      return reply.send(500);
    }
  });
};
export default fp(RootRoute);
