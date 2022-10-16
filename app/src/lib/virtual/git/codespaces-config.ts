import * as cp from 'child_process'

export const setCodespacesGitConfig = (path: string): Promise<boolean> => {
  const host = path.split('::')[1]
  const args = [
    host,
    `grep -q restore-secrets /.codespaces/bin/gitcredential_github.sh || sudo sed -i '/^echo protocol/i . /etc/profile.d/00-restore-secrets.sh' /.codespaces/bin/gitcredential_github.sh`,
  ]
  log.info(`Executing setCodespacesGitConfig: ssh '${args.join(' ')}'`)
  return new Promise((resolve) => {
    cp.execFile('ssh', args, (error) => {
      resolve(!error)
    })
  })
}
