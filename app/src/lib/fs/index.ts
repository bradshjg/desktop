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
    if (path.startsWith(virtualPrefix)) {
      path = path.replace(virtualPrefix, '')
    }
    return remoteFSE('readFile', [path, encoding], {})
  }
  return FSE.readFile(path, encoding)
}
