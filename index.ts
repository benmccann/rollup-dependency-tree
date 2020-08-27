import type { RenderedChunk } from 'rollup';

export interface DependencyTreeOptions {
  includeRoot: boolean;
}

/**
 * Returns the transitive dependencies for all chunks
 * @param chunks - all chunks. dependencies will be calculated for each
 * @param [opts] - the options to use
 * @return a map from chunk.facadeModuleId to dependencies
 */
export function dependenciesForForest(chunks: RenderedChunk[], opts?: DependencyTreeOptions): Record<string,string[]> {
  const result: Record<string,string[]> = {};
  chunks.filter(chunk => chunk.facadeModuleId)
      .forEach(chunk => { result[chunk.facadeModuleId] = Array.from(dependenciesForTree(chunk, chunks, opts)); });
  return result;
};

/**
 * Returns the transitive dependencies for a certain chunk
 * @param chunk - the chunk to get the dependencies of
 * @param chunks - all chunks
 * @param [opts] - the options to use
 * @return the transitive dependencies for the given chunk
 */
export function dependenciesForTree(chunk: RenderedChunk, allChunks: RenderedChunk[], opts?: DependencyTreeOptions): Set<string> {
  return dependenciesForTrees([chunk], allChunks, opts);
}

function dependenciesForTrees(chunksToResolve: RenderedChunk[], allChunks: RenderedChunk[], opts?: DependencyTreeOptions): Set<string> {
  const result = new Set<string>();
  chunksToResolve.forEach(chunk => {
    chunk.imports.forEach(fileName => {
      if (!result.has(fileName)) { // avoid cycles
        result.add(fileName);
        let importedChunks = allChunks.filter(chunk => chunk.fileName === fileName);
        dependenciesForTrees(importedChunks, allChunks).forEach(fileName => result.add(fileName));
      }
    });
    if (opts && opts.includeRoot) {
      result.add(chunk.fileName);
    }
  });
  return result;
}
