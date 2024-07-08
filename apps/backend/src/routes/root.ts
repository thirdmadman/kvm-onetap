import {FastifyInstance} from 'fastify';
import {IReply} from '@/types/interfaces/fastify';
import {findConfigByName} from '@/services/utils/findConfigByName';
import {runJnlpFile} from '@/services/utils/runJnlpFile';
import {generateJnlpFile} from '@/services/file-generators/generateJnlpFile';
import { readConfig } from '@/services/utils/readConfig';

export async function rootRoutes(server: FastifyInstance) {
  server.get('/status', {}, async (request, reply) => {
    try {
      return reply.code(200).send('All good');
    } catch (error) {
      request.log.error(error);
      return reply.send(500);
    }
  });
  server.get<{Reply: IReply<{names: Array<string>}>}>('/', {}, async (request, reply) => {
    try {
      const config = await readConfig();

      if (config === null || undefined) {
        return reply.code(404).send({error: 'Config file not found'});;
      }

      const names = config.kvmList.map((kvmConfig) => kvmConfig.name);

      if (!names || names.length <= 0) {
        return reply.code(404).send({error: 'Config list empty'});
      } else {
        return reply.code(200).send({
          success: true,
          data: {
            names
          }
        });
      }
    } catch (error) {
      return reply.code(400).send({error: error as string});
    }
  });
  server.get<{Params: {name: string}; Reply: IReply<{}>}>('/:name', {}, async (request, reply) => {
    try {
      const {name} = request.params;
      const config = await findConfigByName(name);

      if (config === null || undefined) {
        return reply.code(404).send({error: 'JNPL file not generated'});;
      }

      const filename = await generateJnlpFile(name);

      if (!filename) {
        return reply.code(404).send({error: 'JNPL file not generated'});
      } else {
        runJnlpFile(filename);
        return reply.code(200).send({
          success: true,
        });
      }
    } catch (error) {
      return reply.code(400).send({error: error as string});
    }
  });
}
