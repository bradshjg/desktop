import * as FSE from 'fs-extra'

import { Repository } from '../../models/repository'
import { remoteFSE } from '../virtual/network/client'

const virtualPrefix = 'virtual://'
// HACK HACK HACK this is a hack to get around the fact that if we end up calling path.join(virtual:///foo', 'bar')
// it will return 'virtual:/foo/bar' instead of 'virtual:///foo/bar'...you know because it's not a path and
// at some point we must reckon with that. The above is a hack too, but it feels a little less wrong :-)
const normalizedVirtualPrefix = 'virtual:'

export const repoPathExists = (repository: Repository, path: string): Promise<boolean> => {
  if (repository.path.startsWith(virtualPrefix)) {
    if (path.startsWith(virtualPrefix)) {
      path = path.replace(virtualPrefix, '')
    }
    return remoteFSE("pathExists", [path], {})
  }
  return FSE.pathExists(path)
}

export const repoReadFile = (repository: Repository, path: string, encoding: string = 'utf-8'): Promise<string> => {
  if (repository.path.startsWith(virtualPrefix)) {
    // HACK HACK HACK we need like a path that's not the protocol-y path, this is often joined in the code
    if (path.startsWith(virtualPrefix)) {
      path = path.replace(virtualPrefix, '')
    }
    if (path.startsWith(normalizedVirtualPrefix)) {
      path = path.replace(normalizedVirtualPrefix, '')
    }
    return remoteFSE('readFile', [path, encoding], {})
  }
  return FSE.readFile(path, encoding)
}

/**
 * Read a specific region from a file.
 *
 * @param path  Path to the file
 * @param start First index relative to the start of the file to
 *              read from
 * @param end   Last index (inclusive) relative to the start of the
 *              file to read to
 */
export async function repoReadPartialFile(
  repository: Repository,
  path: string,
  start: number,
  end: number
): Promise<Buffer> {
  return await new Promise<Buffer>((resolve, reject) => {
    if (repository.path.startsWith(virtualPrefix)) {
      repoReadFile(repository, path).then(value => {
        resolve(Buffer.from(value.slice(start, end)))
      })
    }
    else {
      const chunks = new Array<Buffer>()
      let total = 0

      FSE.createReadStream(path, { start, end })
        .on('data', (chunk: Buffer) => {
          chunks.push(chunk)
          total += chunk.length
        })
        .on('error', reject)
        .on('end', () => resolve(Buffer.concat(chunks, total)))
    }})
}
