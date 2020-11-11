import * as assert from 'assert';

export interface Options {
  name: string;
}

export function validate(options: Options) {
  assert(options, 'require options');
  assert(options.name, 'require options.name');
}
