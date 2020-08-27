import { expect } from 'chai';
import type { OutputChunk } from 'rollup';

import { dependenciesForForest } from '../index';
import realworld from './realworld';

describe('test suite', () => {
  it('dependenciesForForest should handle sveltejs/realworld example', () => {
    const rollupData: OutputChunk[] = realworld as OutputChunk[];
    const result = dependenciesForForest(rollupData, { includeRoot: true });
    const deps = result['/home/bmccann/src/svelte-realworld/src/routes/index.svelte'];
    expect(deps.length).equal(5);
  })
});
