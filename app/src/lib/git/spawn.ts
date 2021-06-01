import { GitProcess } from 'dugite'
import * as GitPerf from '../../ui/lib/git-perf'

type ProcessOutput = {
  /** The contents of stdout received from the spawned process */
  output: Buffer
  /** The contents of stderr received from the spawned process */
  error: Buffer
  /** The exit code returned by the spawned process */
  exitCode: number
}

/**
 * Spawn a Git process and buffer the stdout and stderr streams, deferring
 * all processing work to the caller.
 *
 * @param args Array of strings to pass to the Git executable.
 * @param path The path to execute the command from.
 * @param name The name of the operation - for tracing purposes.
 * @param successExitCodes An optional array of exit codes that indicate success.
 * @param stdOutMaxLength  An optional maximum number of bytes to read from stdout.
 *                         If the process writes more than this number of bytes it
 *                         will be killed silently and the truncated output is
 *                         returned.
 */
export function spawnAndComplete(
  args: string[],
  path: string,
  name: string,
  successExitCodes?: Set<number>,
  stdOutMaxLength?: number
): Promise<ProcessOutput> {
  const commandName = `${name}: git ${args.join(' ')}`
  return GitPerf.measure(
    commandName,
    () =>
      new Promise<ProcessOutput>((resolve, _) => {
        GitProcess.exec(args, path).then((result) => {
          resolve({
            output: Buffer.from(result.stdout),
            error: Buffer.from(result.stderr),
            exitCode: result.exitCode
          })
        })
      })
  )
}
