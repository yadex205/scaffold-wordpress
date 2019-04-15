/* global process, task, desc, namespace */

const wpcli = require('../lib/wpcli');

namespace('wp', () => {
  desc('Check WordPress on Docker environment is available');
  task('check', { async: true }, async () => {
    process.stdout.write('Checking WordPress availability...');

    try {
      await wpcli(['core', 'is-installed']);
      process.stdout.write('available\n');
    } catch (error) {
      process.stdout.write('failed.\n');
      console.error('');
      console.error('==================================================');
      console.error('🚨 Please check "docker-compose up" is running. 🚨');
      console.error('==================================================');
      console.error('');
      throw error;
    }
  });
});
