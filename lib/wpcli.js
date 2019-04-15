const { spawn } = require('child_process');

async function wpcli(cliArgs, options = {}) {
  const args = ['docker-compose', 'exec', '-T', 'app', 'wp'].concat(cliArgs);
  const command = args.shift();
  const normalizedOptions = {
    onStdout() {},
    onStderr() {},
    ...options
  };

  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    let isFailed = false;
    const { onStdout, onStderr } = normalizedOptions;
    const proc = spawn(command, args);

    proc.stdout.on('data', chunk => {
      onStdout(chunk.toString());
      stdout += chunk.toString();
    });

    proc.stderr.on('data', chunk => {
      onStderr(chunk.toString());
      stderr += chunk.toString();
    });

    proc.on('error', error => {
      isFailed = true;
      reject(error);
    });

    proc.on('exit', code => {
      if (code !== 0) {
        isFailed = true;
        console.error(stderr);
        reject('Exit with non-zero status');
      }

      if (!isFailed) {
        resolve({ stdout, stderr });
      }
    });
  });
}

module.exports = wpcli;
