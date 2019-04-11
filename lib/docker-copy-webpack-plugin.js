const { exec } = require('child_process');
const { promisify } = require('util');
const webpackLog = require('webpack-log');

const PLUGIN_NAME = 'DockerCopyWebpackPlugin';

class DockerCopyWebpackPlugin {
  constructor({ serviceName, src, dest }) {
    this.serviceName = serviceName;
    this.src = src;
    this.dest = dest;
    this.logger = webpackLog({ name: 'docker-copy-webpack-plugin' });
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapPromise(PLUGIN_NAME, async () => {
      const containerId = await this._getContainerIdAsync();

      if (containerId === null) {
        throw new Error(`Service "${this.serviceName}" not found. Maybe the name "${this.serviceName}" is incorrect.`);
      } else if (containerId === '') {
        this.logger.warn(`Service "${this.serviceName}" is not running. Skip copy.`);
      } else {
        await promisify(exec)(`docker cp ${this.src} ${containerId}:${this.dest}`);
      }
    });
  }

  async _getContainerIdAsync() {
    try {
      const { stdout } = await promisify(exec)(`docker-compose ps -q ${this.serviceName}`);
      return stdout.toString().trim();
    } catch (error) {
      return null;
    }
  }
};

module.exports = DockerCopyWebpackPlugin;
