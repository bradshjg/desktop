import { Repository } from '../../../models/repository'
import * as cp from 'child_process'

export const setCodespacesGitConfig = (repository: Repository): Promise<boolean> => {
  const host = repository.path.split('::')[1]
  const args = [
    host,
    `grep -q codespaces /.codespaces/bin/gitcredential_github.sh || sudo sed -i '/^echo protocol/i . /etc/profile.d/codespaces.sh' /.codespaces/bin/gitcredential_github.sh`,
  ]
  return new Promise((resolve) => {
    if (repository.isSSHRepository) {
      log.info(`Executing setCodespacesGitConfig: ssh '${args.join(' ')}'`)
      cp.execFile('ssh', args, (error) => {
        resolve(!error)
      })
    } else {
      resolve(false)
    }
  })
}
