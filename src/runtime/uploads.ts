import type { BinaryInput, NodeLikeReadableStream } from '../types'
import { streamToBytes } from '../utils/streamToBytes'

function isNodeLikeReadableStream(
  value: unknown,
): value is NodeLikeReadableStream {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as NodeLikeReadableStream).on === 'function'
  )
}

function toArrayBufferUint8Array(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  const arrayBuffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer
  return new Uint8Array(arrayBuffer)
}

function toBlobPartUint8Array(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  return toArrayBufferUint8Array(bytes)
}

export const prepareFile = async (
  file: BinaryInput,
  fileType: string,
): Promise<Blob | File> => {
  if (typeof Blob === 'undefined') {
    throw new Error(
      'Blob is not available in this runtime. Use Node.js 18+ or provide a Blob implementation.',
    )
  }
  if (file instanceof Blob) return file
  if (typeof File !== 'undefined' && file instanceof File) return file
  if (file instanceof ArrayBuffer) return new Blob([file], { type: fileType })
  if (file instanceof Uint8Array) {
    return new Blob([toArrayBufferUint8Array(new Uint8Array(file))], {
      type: fileType,
    })
  }

  if (isNodeLikeReadableStream(file)) {
    const buffer = await streamToBytes(file)
    return new Blob([toBlobPartUint8Array(buffer)], {
      type: fileType,
    })
  }

  const type = file === null ? 'null' : typeof file
  const constructorName =
    file &&
    typeof file === 'object' &&
    'constructor' in file &&
    (file as { constructor?: { name?: string } }).constructor?.name
      ? ` (${(file as { constructor: { name: string } }).constructor.name})`
      : ''
  throw new Error(`Unsupported file input type: ${type}${constructorName}`)
}
