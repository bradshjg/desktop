import * as FSE from 'fs-extra'

import { Repository } from '../../models/repository'
import { remoteFSE } from '../virtual/network/client'

const virtualPrefix = 'virtual://'

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
      if (path.startsWith(virtualPrefix)) {
        path = path.replace(virtualPrefix, '')
      }
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
