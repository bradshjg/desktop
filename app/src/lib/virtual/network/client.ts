import { request } from 'http'
import { ChildProcess, execFile, ExecOptionsWithStringEncoding } from 'child_process'

export class ExecFileError extends Error {
  public code: string

  public constructor(message: string, code: string) {
    super(message)
    this.name = 'ExecFileError'
    this.code = code
  }
}

export interface IVirtualExecOptions extends ExecOptionsWithStringEncoding {
  stdin?: string
}

export function remoteExecFile(_: string, args: string[], options: IVirtualExecOptions, cb: (error: ExecFileError | null, stdout: string, stderr: string) => void): ChildProcess {
  httpRequest("/git", {args: args, options: options}).then((result) => {
    const stdout = result.stdout
    const stderr = result.stderr
    let error = result.error
    if (error) {
      error = new ExecFileError(JSON.stringify(error), error.code)
    }
    cb(error, stdout, stderr)
  })
  return execFile('true')
}

export function remoteFSE(fn: string, args: string[], options: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const res = httpRequest("/fse", { "function": fn, args: args, options: options })
    res.then(result => { resolve(result.result) })
  })
}

function httpRequest(path: string, payload: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload)
    const postOptions = {
      host: 'localhost',
      port: '9195',
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }
    const req = request(postOptions, (res) => {
      res.setEncoding('utf8');
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        resolve(JSON.parse(data))
      })
    })
    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`)
      reject(e)
    })
    req.write(postData)
    req.end()
  })
}
