import {FastifyInstance} from 'fastify';
import {IReply} from '@/types/interfaces/fastify';
import {findConfigByName} from '@/services/utils/findConfigByName';
import {runJnlpFile} from '@/services/utils/runJnlpFile';
import {generateJnlpFile} from '@/services/file-generators/generateJnlpFile';
import {readConfig} from '@/services/utils/readConfig';
import {createReadStream, ReadStream} from 'node:fs';
import { resolve } from 'node:path';
import { IKvmGroup } from '@/types/interfaces/IConfig';

export async function rootRoutes(server: FastifyInstance) {
  server.get('/status', {}, async (request, reply) => {
    try {
      return reply.code(200).send('All good');
    } catch (error) {
      request.log.error(error);
      return reply.send(500);
    }
  });
  server.get<{Reply: IReply<{names: Array<{name: string; groupId: number}>; groups: Array<IKvmGroup>}>}>('/', {}, async (request, reply) => {
    try {
      const config = await readConfig();

      if (config === null || undefined) {
        return reply.code(404).send({error: 'Config file not found'});
      }

      const namesArray = config.kvmList.map((kvmConfig) => ({name: kvmConfig.name, groupId: kvmConfig.groupId}));

      const groups = config.kvmGroups;

      if (!namesArray || namesArray.length <= 0) {
        return reply.code(404).send({error: 'Config list empty'});
      } else {
        return reply.code(200).send({
          success: true,
          data: {
            names: namesArray,
            groups
          },
        });
      }
    } catch (error) {
      return reply.code(400).send({error: error as string});
    }
  });
  server.get<{
    Querystring: {
      download: string | undefined;
    };
    Params: {name: string};
    Reply: IReply<{}> | ReadStream;
  }>('/:name', {}, async (request, reply) => {
    try {
      const {name} = request.params;
      const config = await findConfigByName(name);

      if (config === null || undefined) {
        return reply.code(404).send({error: 'JNPL file not generated'});
      }

      const filename = await generateJnlpFile(name);

      const {download} = request.query;

      if (!filename) {
        return reply.code(404).send({error: 'JNPL file not generated'});
      }

      if (download && download === 'true') {
        const stream = createReadStream(resolve(filename))
        return reply.type('application/x-java-jnlp-file').send(stream);
      }

      runJnlpFile(filename);
      return reply.code(200).send({
        success: true,
      });

    } catch (error) {
      return reply.code(400).send({error: error as string});
    }
  });
}
