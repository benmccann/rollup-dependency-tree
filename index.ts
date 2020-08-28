import type { RenderedChunk } from 'rollup';

export interface DependencyTreeOptions {
  /**
   * Whether to include the chunk itself. Defaults to true.
   */
  includeRoot?: boolean;

  /**
   * Function to decide whether to include a dynamic import.
   * If not provided no dynamic imports are included.
   */
  dynamicImports?: (chunk: RenderedChunk) => boolean;
}

/**
 * Returns the transitive dependencies for all chunks
 * @param chunks - all chunks. dependencies will be calculated for each
 * @param [opts] - the options to use
 * @return a map from chunk.facadeModuleId to dependencies
 */
export function dependenciesForForest(chunks: RenderedChunk[], opts?: DependencyTreeOptions): Record<string,RenderedChunk[]> {
  const result: Record<string,RenderedChunk[]> = {};
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
export function dependenciesForTree(chunk: RenderedChunk, allChunks: RenderedChunk[], opts?: DependencyTreeOptions): Set<RenderedChunk> {
  return dependenciesForTrees([chunk], allChunks, opts);
}

function dependenciesForTrees(chunksToResolve: RenderedChunk[], allChunks: RenderedChunk[], opts?: DependencyTreeOptions): Set<RenderedChunk> {
  const result = new Set<RenderedChunk>();
  chunksToResolve.forEach(chunk => {
    chunk.imports.forEach(fileName => {
      let importedChunk = allChunks.find(chunk => chunk.fileName === fileName);
      if (!result.has(importedChunk)) { // avoid cycles
        result.add(importedChunk);
        dependenciesForTree(importedChunk, allChunks, opts).forEach(c => result.add(c));
      }
    });
    if (opts && opts.dynamicImports) {
      chunk.dynamicImports.forEach(fileName => {
        const c = allChunks.find(chunk => chunk.fileName === fileName);
        if (opts.dynamicImports(c)) {
          result.add(c);
        }
      });
    }
    if (!opts || opts.includeRoot !== false) {
      result.add(chunk);
    }
  });
  return result;
}
