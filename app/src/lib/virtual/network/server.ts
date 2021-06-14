import { execFile } from 'child_process'
import { createServer } from 'http'
import { Readable } from 'stream'

// create a server
const server = createServer((request, response) => {
  // parse request to json
  let body = ''
  request.on('data', chunk => {
    body += chunk
  })
  request.on('end', () => {
    // verify POST
    if (request.method !== 'POST') {
      response.statusCode = 400
      response.end()
    } else {
    // parse json
    const data = JSON.parse(body)
    // execute command
    const spawnedProcess = execFile('git', data.args, data.options, (error, stdout, stderr) => {
      // send response
      response.writeHead(200, {'Content-Type': 'application/json'})
      response.end(JSON.stringify({
        error: error,
        stdout: stdout,
        stderr: stderr
      }))
    })
    if (data.options.stdin) {
      const stdinStream = new Readable()
      stdinStream.push(data.options.stdin)
      stdinStream.push(null)
      if (spawnedProcess.stdin) {
        stdinStream.pipe(spawnedProcess.stdin)
      }
    }
  }})
})

console.log('listening on port 9195')
server.listen(9195)
