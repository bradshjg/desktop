
import { IGitExecutionOptions, IGitResult } from '../../git/core'
import { remoteExecFile, IVirtualExecOptions } from '../network/client'

/**
 * Execute a git command and read the output using the virtual (remote) Git environment.
 *
 * The returned promise will reject when the git executable fails to launch,
 * in which case the thrown Error will have a string `code` property. See
 * `errors.ts` for some of the known error codes.
 *
 * See the result's `stderr` and `exitCode` for any potential git error
 * information.
 */
export function exec(args: string[], path: string, options?: IGitExecutionOptions): Promise<IGitResult> {
  return new Promise<IGitResult>(function(resolve, reject) {
    // Explicitly annotate opts since typescript is unable to infer the correct
    // signature for execFile when options is passed as an opaque hash. The type
    // definition for execFile currently infers based on the encoding parameter
    // which could change between declaration time and being passed to execFile.
    // See https://git.io/vixyQ
    const url = new URL(path)
    const execOptions: IVirtualExecOptions = {
      cwd: url.pathname,
      encoding: 'utf8',
      maxBuffer: options?.maxBuffer || 10 * 1024 * 1024,
      env: process.env
    }

    if (options && options.stdin !== undefined) {
      execOptions.stdin = options.stdin.toString()
    }

    remoteExecFile('git', args, execOptions, function(
      err: Error | null,
      stdout: string,
      stderr: string
    ) {
        if (!err) {
          resolve({ stdout, stderr, exitCode: 0, gitError: null, gitErrorDescription: null, combinedOutput: stdout + stderr, path: url.pathname })
        } else {
          reject(err)
        }
      }
    )
})}
