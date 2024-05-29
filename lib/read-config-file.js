/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const findConfig = require('find-config');
const path = require('path');
const log = require('./logger');

const readConfigFile = (CZ_CONFIG_NAME = '.cz-config.js') => {
  // First try to find the .cz-config.js config file
  // It seems like find-config still locates config files in the home directory despite of the home:false prop.
  const czConfig = findConfig.require(CZ_CONFIG_NAME, { home: false });

  if (czConfig) {
    return czConfig;
  }

  // fallback to locating it using the config block in the nearest package.json
  let pkg = findConfig('package.json', { home: false });

  if (pkg) {
    const pkgDir = path.dirname(pkg);

    pkg = require(pkg);

    if (pkg.config && pkg.config['cz-customizable-2'] && pkg.config['cz-customizable-2'].config) {
      // resolve relative to discovered package.json
      const pkgPath = path.resolve(pkgDir, pkg.config['cz-customizable-2'].config);

      log.info('>>> Using cz-customizable config specified in your package.json: ', pkgPath);

      return require(pkgPath);
    }
  }

  /* istanbul ignore next */
  log.error(
    'Unable to find a configuration file. Please refer to documentation to learn how to set up: https://github.com/ordinary-fdev/cz-customizable-2#steps "'
  );
  return null;
};

module.exports = readConfigFile;
