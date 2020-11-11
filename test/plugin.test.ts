import {expect} from 'chai';
import {describe, it} from 'mocha';

import Plugin from '@main';
import fastify from 'fastify';

describe('test plugin', () => {
  it('register plugin', async () => {
    const app = fastify();
    app.register(Plugin, {name: 'test'});
    expect(async () => {
      await app.listen(0);
      await app.close();
    }).not.throw();
  });
});
