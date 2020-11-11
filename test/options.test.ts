import {expect} from 'chai';
import {describe, it} from 'mocha';
import {validate} from '@core/options';

describe('test options', () => {
  it('assert expect "require options"', async () => {
    expect(() => {
      validate(undefined as never);
    }).to.throw('require options');
  });

  it('assert expect "require options.name"', async () => {
    expect(() => {
      validate({
        name: undefined as never,
      });
    }).to.throw('require options.name');
  });
});
