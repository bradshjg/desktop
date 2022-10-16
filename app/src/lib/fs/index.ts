import * as FSE from 'fs-extra'

import { Repository } from '../../models/repository'
import { remotePathExists, remoteReadFile, remoteReadPartialFile } from '../virtual/fs/core'

const isSSHRepo = (repository: Repository): Boolean => {
  return repository.path.startsWith('ssh::')
}

const sshPath = (path: string) => {
  // HACK HACK HACK the path is probably something like ssh::someHost::/path/to/file...but maybe it's /path/to/file
  // so we handle both cases by splitting on :: and taking the last element
  return path.split('::').slice(-1).pop() || path
}

export const repoPathExists = (repository: Repository, path: string): Promise<boolean> => {
  if (isSSHRepo(repository)) {
    path = sshPath(path)
    return remotePathExists(repository, path)
  }
  return FSE.pathExists(path)
}

export const repoReadFile = (repository: Repository, path: string, encoding: string = 'utf-8'): Promise<string> => {
  if (isSSHRepo(repository)) {
    path = sshPath(path)
    return remoteReadFile(repository, path)
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
    if (isSSHRepo(repository)) {
      path = sshPath(path)
      remoteReadPartialFile(repository, path, start, end).then(value => {
        resolve(Buffer.from(value))
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
