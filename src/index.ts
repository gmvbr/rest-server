import Fp from 'fastify-plugin';
import {Options, validate} from '@core/options';

export default Fp<Options>(async (_, options) => {
  validate(options);
});
