import type { Express } from 'express-serve-static-core';

import typeormLoader from './typeormLoader';
import expressLoader from './expressLoader';

async function init({ expressApp }: { expressApp: Express }): Promise<void> {
  await typeormLoader();
  await expressLoader({ app: expressApp });
}

export default {
  init,
};
