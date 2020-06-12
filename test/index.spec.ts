import { expect } from 'chai';
import type { OutputChunk } from 'rollup';

import dependencyTree from '../index';
import realworld from './realworld';

describe('test suite', () => {
  it('dependencyTree should handle sveltejs/realworld example', () => {
    const rollupData: OutputChunk[] = realworld as OutputChunk[];
    const result = dependencyTree(rollupData);
    const deps = result['/home/bmccann/src/svelte-realworld/src/routes/index.svelte'];
    expect(deps.length).equal(5);
  })
});
