import type { Express } from 'express-serve-static-core';

import typeormLoader from './typeorm';
import expressLoader from './express';
import dummyLoader from './dummy';

async function init({ expressApp }: { expressApp: Express }): Promise<void> {
  await typeormLoader();
  await expressLoader({ app: expressApp });
  await dummyLoader();
}

export default {
  init,
};
