import 'reflect-metadata';

import Fastify, {
  FastifyHttp2Options,
  FastifyHttpsOptions,
  FastifyInstance,
  FastifyLoggerInstance,
  FastifyServerOptions,
} from 'fastify';

import EnvSchema, {EnvSchemaOpt} from 'env-schema';
import FastifyJWT, {FastifyJWTOptions} from 'fastify-jwt';
import FastifyCors, {FastifyCorsOptions} from 'fastify-cors';
import FastifyStatic, {FastifyStaticOptions} from 'fastify-static';
import FastifyFormbody, {FormBodyPluginOptions} from 'fastify-formbody';
import FastifyMultipart, {FastifyMultipartOptions} from 'fastify-multipart';

import FastifySensible from 'fastify-sensible';
import FastifyHelmet from 'fastify-helmet';
import FastifyAutoload from 'fastify-autoload';
import FastifyAuth from 'fastify-auth';
import FastifyMongodb from 'fastify-mongodb';

import {MongoClientOptions} from 'mongodb';
import {hashSync, compareSync} from 'bcrypt';

import Helmet from 'helmet';

export type HelmetOptions = Parameters<typeof Helmet>[0];

export type ServerOptions =
  | FastifyServerOptions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | FastifyHttpsOptions<any, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | FastifyHttp2Options<any, any>
  | FastifyLoggerInstance;

declare module 'fastify' {
  interface FastifyInstance {
    environment: {
      [k: string]: unknown;
    };
    bcrypt: {
      hashSync: typeof hashSync;
      compareSync: typeof compareSync;
    };
  }
}

export interface Config {
  path: {
    plugins: string;
    services: string;
  };
  environment?: EnvSchemaOpt;
  auth?: boolean;
  sensible?: boolean;
  static?: FastifyStaticOptions[];
  helmet?: HelmetOptions;
  jwt?: FastifyJWTOptions;
  formbody?: FormBodyPluginOptions;
  multipart?: FastifyMultipartOptions;
  cors?: FastifyCorsOptions;
  mongodb?: FastifyMongodb.FastifyMongodbOptions & MongoClientOptions;
}

function _getEnvironment(config: Config) {
  let environment = {};
  if (config.environment) {
    environment = Object.assign({}, EnvSchema(config.environment));
  }
  return environment;
}

function _getInstance(options?: ServerOptions) {
  const fastifyInstanceOptions = Object.assign(
    {
      logger: process.env.NODE_ENV !== 'production',
    },
    options || {}
  );
  return Fastify(fastifyInstanceOptions);
}

function _loadBcrypt() {
  return {
    hashSync,
    compareSync,
  };
}

export function createRestServer(
  config: Config,
  options?: ServerOptions
): FastifyInstance {
  const fastify = _getInstance(options);

  if (config.environment) {
    fastify.environment = _getEnvironment(config);
  }

  fastify.decorate('bcrypt', _loadBcrypt());

  if (config.cors !== undefined) {
    fastify.register(FastifyCors, config.cors);
  }

  if (config.mongodb !== undefined) {
    fastify.register(FastifyMongodb, config.mongodb);
  }

  if (config.sensible !== undefined) {
    fastify.register(FastifySensible);
  }

  if (config.auth === true) {
    fastify.register(FastifyAuth);
  }

  if (config.jwt !== undefined) {
    fastify.register(FastifyJWT, config.jwt);
  }

  if (config.formbody !== undefined) {
    fastify.register(FastifyFormbody, config.formbody);
  }

  if (config.multipart !== undefined) {
    fastify.register(FastifyMultipart, config.multipart);
  }

  if (config.helmet !== undefined) {
    fastify.register(FastifyHelmet, config.helmet);
  }

  if (config.static !== undefined) {
    let init = false;
    for (const option of config.static) {
      if (init === true) {
        option.decorateReply = false;
      } else {
        option.decorateReply = true;
      }
      fastify.register(FastifyStatic, option);
      init = true;
    }
  }

  fastify.register(FastifyAutoload, {
    dir: config.path.plugins,
  });

  fastify.register(FastifyAutoload, {
    dir: config.path.services,
  });

  return fastify;
}

export async function launch(
  fastify: FastifyInstance,
  port = '8080',
  host = '127.0.0.1'
) {
  const info = await fastify.listen(
    process.env.PORT || port,
    process.env.HOST || host
  );
  console.log(info);
}
