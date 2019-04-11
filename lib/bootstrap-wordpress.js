const wp = require('./wp');

function normalizeConfig(rawConfig) {
  const config = {
    plugins: [],
    config: {},
    option: {},
    ...rawConfig
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
