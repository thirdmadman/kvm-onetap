import {defineConfig} from '@julr/vite-plugin-validate-env';
import {z} from 'zod';

export default defineConfig({
  validator: 'zod',
  schema: {
    VITE_API_PORT: z
      .preprocess(
        (value) => Number(value),
        z.optional(z.number().int().gte(1000, 'Port must be greater than 1000').max(65535, 'Port must be less than 65535'))
      )
      .default(5000),
    VITE_API_PREFIX: z.optional(z.string().min(1, 'Prefix too short')).default('api'),
    VITE_UI_PORT: z
      .preprocess(
        (value) => Number(value),
        z.optional(z.number().int().gte(1000, 'Port must be greater than 1000').max(65535, 'Port must be less than 65535'))
      )
      .default(3000),
  },
});
