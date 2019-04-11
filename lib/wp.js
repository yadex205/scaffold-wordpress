const { spawn } = require('child_process');

async function wp(...args) {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    let failed = false;

    args = ['exec', '-T', 'app', 'wp'].concat(args);

    const proc = spawn('docker-compose', args);
    proc.stdout.on('data', chunk => {
      process.stdout.write(chunk);
      stdout += chunk.toString();
    });
    proc.stderr.on('data', chunk => {
      process.stderr.write(chunk);
      stderr += chunk.toString();
    });
    proc.on('error', err => {
      failed = true;
      reject(err);
    })
    proc.on('exit', code => {
      if (code !== 0) {
        failed = true;
        reject('Exit with non-zero status');
      }

      if (!failed) {
        resolve({ stdout, stderr });
      }
    });
  });
}

module.exports = wp;
