export interface NodeLikeReadableStream {
  pipe?<T = unknown>(destination: T, options?: { end?: boolean }): T
  on(event: 'data', listener: (chunk: unknown) => void): unknown
  on(event: 'end', listener: () => void): unknown
  on(event: 'error', listener: (error: unknown) => void): unknown
}

export type BinaryDownload = Blob | NodeLikeReadableStream
export type BinaryInput =
  Blob | File | ArrayBuffer | Uint8Array | Pick<NodeLikeReadableStream, 'on'>
