import { expect } from 'chai';
import type { OutputChunk } from 'rollup';

import { dependenciesForTree } from '../index';
import realworld from './realworld';
import index2 from './index2';

describe('test suite', () => {
  it('dependenciesForTree should handle sveltejs/realworld example', () => {
    const rollupData: OutputChunk[] = realworld as unknown as OutputChunk[];
    const entryChunk = rollupData.find(c => c.facadeModuleId && c.facadeModuleId.endsWith('routes/index.svelte'));
    const result = dependenciesForTree(entryChunk, rollupData, { walk: ctx => !ctx.dynamicImport });
    expect(result.size).equal(5);
  })
});

describe('test suite', () => {
  it('dependenciesForTree should handle sapper css index2 test', () => {
    const rollupData: OutputChunk[] = index2 as unknown as OutputChunk[];
    const entryChunk = rollupData.find(c => c.facadeModuleId && c.facadeModuleId.endsWith('routes/index2.svelte'));
    const result = dependenciesForTree(entryChunk, rollupData, { walk: ctx => !ctx.dynamicImport });
    expect(result.size).equal(3);
  })
});
