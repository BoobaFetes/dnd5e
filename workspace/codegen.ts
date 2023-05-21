import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://www.dnd5eapi.co/graphql',
  documents: undefined,
  generates: {
    './libs/dnd5e-domain/src/lib/dto/': {
      preset: 'client',
      plugins: [],
    },
    './libs/dnd5e-domain/src/lib/graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;
