import { NodeLikeReadableStream } from '../types';

function isBuffer(value: unknown): boolean {
  return typeof Buffer !== 'undefined' && Buffer.isBuffer(value);
}

function normalizeChunk(chunk: unknown): Uint8Array {
  if (chunk instanceof Uint8Array) return chunk;
  if (chunk instanceof ArrayBuffer) return new Uint8Array(chunk);
  if (typeof chunk === 'string') return new TextEncoder().encode(chunk);
  if (isBuffer(chunk)) return new Uint8Array(chunk as Uint8Array);
  throw new Error('Unsupported stream chunk type');
}

export function streamToBytes(
  stream: NodeLikeReadableStream,
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', (chunk) => chunks.push(normalizeChunk(chunk)));
    stream.on('end', () => {
      const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
      const result = new Uint8Array(total);
      let offset = 0;
      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }
      resolve(result);
    });
    stream.on('error', reject);
  });
}
