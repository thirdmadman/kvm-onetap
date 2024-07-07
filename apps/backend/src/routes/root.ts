import {FastifyInstance} from 'fastify';
import {IReply} from '@/types/interfaces/fastify';
import {findConfigByName} from '@/services/utils/findConfigByName';
import {runJnlpFile} from '@/services/utils/runJnlpFile';
import {generateJnlpFile} from '@/services/file-generators/generateJnlpFile';

export async function rootRoutes(server: FastifyInstance) {
  server.get('/status', {}, async (request, reply) => {
    try {
      return reply.code(200).send('All good');
    } catch (error) {
      request.log.error(error);
      return reply.send(500);
    }
  });
  server.get<{Querystring: {name: string}; Reply: IReply<{}>}>('/', {}, async (request, reply) => {
    try {
      const {name} = request.query;
      const config = await findConfigByName(name);

      if (config === null || undefined) {
        return reply.code(404).send({error: 'JNPL file not generated'});;
      }

      const filename = await generateJnlpFile(name);

      if (!filename) {
        return reply.code(404).send({error: 'JNPL file not generated'});
      } else {
        await runJnlpFile(filename);
        return reply.code(200).send({
          success: true,
        });
      }
    } catch (error) {
      return reply.code(400).send({error: error as string});
    }
  });
}
