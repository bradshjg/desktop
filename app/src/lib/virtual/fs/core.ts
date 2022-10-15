import { Repository } from '../../../models/repository'
import * as cp from 'child_process'

const remoteCommand = (path: string, command: string) => {
  const host = path.split('::')[1]
  const remotePath = path.split('::')[2]
  return `ssh ${host} 'cd ${remotePath} && ${command}'`
}

export const remotePathExists = (repository: Repository, path: string): Promise<boolean> => {
  const command = remoteCommand(repository.path, `test -f ${path}`)
  return new Promise((resolve) => {
    cp.exec(command, (error) => {
      resolve(error?.code === 0)
    })
  })
}

export const remoteReadFile = (repository: Repository, path: string): Promise<string> => {
  const command = remoteCommand(repository.path, `cat ${path}`)
  return new Promise((resolve) => {
    cp.exec(command, (error, stdout, stderr) => {
      resolve(stdout)
    })
  })
}

export const remoteReadPartialFile = (
  repository: Repository,
  path: string,
  start: number,
  end: number
): Promise<string> => {
  const command = remoteCommand(repository.path, `cat ${path} | tail -c +${start} | head -c ${end - start}`)
  return new Promise((resolve) => {
    cp.exec(command, (error, stdout, stderr) => {
      resolve(stdout)
    })
  })
}
