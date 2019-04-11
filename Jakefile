/* global jake, task, desc, namespace */

const { exec } = require('child_process');
const { promisify } = require('util');
const wp = require('./lib/wp');
const config = require('./wordpress.config');
const bootstrapWordPress = require('./lib/bootstrap-wordpress');

namespace('wordpress', () => {
  task('bootstrap', ['check-availability', 'build'], { async: true }, async () => {
    await bootstrapWordPress(config);
  });

  task('check-availability', { async: true }, async () => {
    jake.logger.log('Checking WordPress availability...');

    try {
      await wp('cli', 'version');
      await wp('core', 'is-installed');
      jake.logger.log('WordPress is available')
    } catch (error) {
      jake.logger.error('WordPress is not available on Docker environment');
      throw error;
    }
  });
});

task('build', { async: true }, async () => {
  const { stdout } = await promisify(exec)('npm run build');
  jake.logger.log(stdout);
});
