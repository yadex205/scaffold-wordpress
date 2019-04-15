/* global process, jake, task, desc, namespace */

const { exec } = require('child_process');
const { promisify } = require('util');
const { networkInterfaces } = require('os');
const wpcli = require('../lib/wpcli');
const rawConfig = require('../wordpress.config');

namespace('wp', () => {
  task('bootstrap', ['wp:check'], { async: true }, async () => {
    jake.logger.log('Start bootstrapping WordPress environment');

    let activeAddress = null;
    for (let [_, connections] of Object.entries(networkInterfaces)) {
      for (let con of connections) {
        if (con.family === 'IPv4' && con.internal === false && con.address) {
          activeAddress = con.address;
          break;
        }
      }
      if (activeAddress !== null) { break; }
    }
    if (activeAddress === null) { activeAddress = '127.0.0.1'; }

    const config = {
      ...rawConfig,
      plugins: [
        ...rawConfig.plugins
      ].map(plugin => (typeof plugin === 'string' ? { local: false, slug: plugin } : plugin)),
      config: { ...rawConfig.config },
      option: {
        siteurl: `http://${activeAddress}:8000`,
        home: `http://${activeAddress}:8000`,
        ...rawConfig.option
      },
      theme: (rawConfig.theme === 'string' ? { local: false, slug: rawConfig.theme } : rawConfig.theme)
    };

    process.stdout.write('Run building process...');
    await promisify(exec)('npm run build');
    process.stdout.write('done\n');

    process.stdout.write('Setting theme...');
    if (config.theme) {
      if (config.theme.local === false) {
        await wpcli(['theme', 'install', '--activate', config.theme.slug]);
      } else {
        await wpcli(['theme', 'activate', config.theme.slug]);
      }
    }
    process.stdout.write('done\n');

    const remotePlugins = config.plugins.filter(plugin => (plugin.local === false)).map(plugin => plugin.slug);
    if (remotePlugins.length > 0) {
      process.stdout.write('Installing plugins from online...');
      await wpcli(['plugin', 'install', '--activate', ...remotePlugins]);
      process.stdout.write('done\n');
    }

    const localPlugins = config.plugins.filter(plugin => (plugin.local === true)).map(plugin => plugin.slug);
    if (localPlugins.length > 0) {
      process.stdout.write('Activating local plugins...');
      await wpcli(['plugin', 'activate', ...localPlugins]);
      process.stdout.write('done\n');
    }

    process.stdout.write('Setting WordPress configs...');
    for (let key in config.config) {
      await wpcli(['config', 'set', key, config.config[key], '--raw']);
    }
    process.stdout.write('done\n');

    process.stdout.write('Setting WordPress options...');
    for (let key in config.option) {
      await wpcli(['option', 'update', key, config.option[key]]);
    }
    process.stdout.write('done\n');

    console.info('');
    console.info('==================');
    console.info('🎉 Boostrapped! 🎉');
    console.info('==================');
    console.info('');
  });
});
