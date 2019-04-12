const { exec } = require('child_process');
const { promisify } = require('util');
const webpackLog = require('webpack-log');

const PLUGIN_NAME = 'ScaffoldWordpressCopyWebpackPlugin';

class ScaffoldWordpressCopyWebpackPlugin {
  constructor({ type }) {
    this.type = type;
    this.logger = webpackLog({ name: 'scaffold-wordpress-copy-webpack-plugin' });

    if (!this.type) {
      throw new Error('"type" is not provided');
    }
  }

  apply(compiler) {
    if (!compiler.options.output || !compiler.options.output.path) {
      throw new Error('Cannot find "options.output" in webpack config');
    }

    compiler.hooks.afterEmit.tapPromise(PLUGIN_NAME, async () => {
      const containerId = await this._getContainerIdAsync();

      if (containerId === '') {
        this.logger.warn(`Container is not running. Skip copy.`);
      } else {
        const source = compiler.options.output.path;
        const destination = {
          theme: '/usr/local/site/wp-content/themes',
          plugin: '/usr/local/site/wp-content/plugins'
        }[this.type];

        await promisify(exec)(`docker cp ${source} ${containerId}:${destination}`);
      }
    });
  }

  async _getContainerIdAsync() {
    try {
      const { stdout } = await promisify(exec)('docker-compose ps -q app');
      return stdout.toString().trim();
    } catch (error) {
      return null;
    }
  }
};

module.exports = ScaffoldWordpressCopyWebpackPlugin;
