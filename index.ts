import type { OutputChunk } from 'rollup';

export default function(chunks: OutputChunk[]): Record<string,string[]> {
  const result: Record<string,string[]> = {};
  chunks.filter(chunk => chunk.facadeModuleId)
      .forEach(chunk => { result[chunk.facadeModuleId] = Array.from(getImports(chunks, [chunk])); });
  return result;
};

function getImports(allChunks: OutputChunk[], chunksToResolve: OutputChunk[]): Set<string> {
  const result = new Set<string>();
  chunksToResolve.forEach(chunk => {
    chunk.imports.forEach(fileName => {
      if (!result.has(fileName)) { // avoid cycles
        result.add(fileName);
        let importedChunks = allChunks.filter(chunk => chunk.fileName === fileName);
        getImports(allChunks, importedChunks).forEach(fileName => result.add(fileName));
      }
    });
    result.add(chunk.fileName);
  });
  return result;
}
