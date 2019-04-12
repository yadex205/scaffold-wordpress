const os = require('os');
const wp = require('./wp');

function getActiveIP() {
  for (let [iname, connections] of Object.entries(os.networkInterfaces())) {
    for (let con of connections) {
      if (con.family === 'IPv4' && con.internal === false && con.address) {
        return con.address;
      }
    }
  }
}

function normalizeConfig(rawConfig) {
  const activeAddress = getActiveIP() || 'localhost';
  const config = {
    ...rawConfig,
    plugins: [
      ...rawConfig.plugins
    ],
    config: {
      ...rawConfig.config
    },
    option: {
      siteurl: `http://${activeAddress}:8000`,
      home: `http://${activeAddress}:8000`,
      ...rawConfig.option
    }
  };

  if (typeof config.theme === 'string') {
    config.theme = {
      slug: config.theme,
      local: false
    };
  }

  for (let i = 0; i < config.plugins.length; i++) {
    if (typeof config.plugins[i] === 'string') {
      config.plugins[i] = {
        slug: config.plugins[i],
        local: false
      };
    }
  }

  return config;
}

async function bootstrapWordPress(rawConfig) {
  const config = normalizeConfig(rawConfig);

  if (config.theme) {
    if (config.theme.local === false) {
      await wp('theme', 'install', '--activate', config.theme.slug)
    } else {
      await wp('theme', 'activate', config.theme.slug);
    }
  }

  const remotePlugins = config.plugins.filter(plugin => (plugin.local === false)).map(plugin => plugin.slug);
  await wp('plugin', 'install', '--activate', ...remotePlugins);

  const localPlugins = config.plugins.filter(plugin => (plugin.local === true)).map(plugin => plugin.slug);
  await wp('plugin', 'activate', ...localPlugins);

  for (let key in config.config) {
    await wp('config', 'set', key, config.config[key], '--raw');
  }

  for (let key in config.option) {
    await wp('option', 'update', key, config.option[key]);
  }
}

module.exports = bootstrapWordPress;
