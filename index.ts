import type { RenderedChunk } from 'rollup';

export interface DependencyTreeContext {
  chunk: RenderedChunk;
  dynamicImport: boolean;
}

export interface DependencyTreeOptions {

  filter?: (context: DependencyTreeContext) => boolean;

  walk?: (context: DependencyTreeContext) => boolean;

}

/**
 * Returns the transitive dependencies for a certain chunk
 * @param chunk - the chunk to get the dependencies of
 * @param chunks - all chunks
 * @param [opts] - the options to use
 * @return the transitive dependencies for the given chunk
 */
export function dependenciesForTree(chunk: RenderedChunk, allChunks: RenderedChunk[], opts?: DependencyTreeOptions): Set<RenderedChunk> {
  const result = new Set<RenderedChunk>();
  dependenciesForTrees(result, chunk, allChunks, false, opts);
  return result;
}

function addChunk(chunk, result, opts, dynamicImport) {
  if (!opts || !opts.filter || opts.filter({chunk, dynamicImport})) {
    result.add(chunk);
  }
}

function dependenciesForTrees(result: Set<RenderedChunk>, chunkToResolve: RenderedChunk, allChunks: RenderedChunk[], dynamicImport: boolean, opts?: DependencyTreeOptions) {
  if (opts && opts.walk && !opts.walk({chunk: chunkToResolve, dynamicImport})) {
    return;
  }
  addChunk(chunkToResolve, result, dynamicImport, false);
  chunkToResolve.imports.concat(chunkToResolve.dynamicImports).forEach(fileName => {
    let chunk = allChunks.find(c => c.fileName === fileName);
    if (chunk && !result.has(chunk)) { // avoid cycles
      const dynamicImport = chunkToResolve.imports.indexOf(chunk.fileName) < 0;
      dependenciesForTrees(result, chunk, allChunks, dynamicImport, opts);
    }
  });
}
