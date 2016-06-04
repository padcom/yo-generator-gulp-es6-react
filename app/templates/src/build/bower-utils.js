var _ = require('lodash');

function unloadModule(module) {
  var name = require.resolve(module);
  delete require.cache[name];
}

function getBowerPackageIds() {
  var bowerManifest = {};
  try {
    unloadModule('../../bower.json');
    manifest = require('../../bower.json');
  } catch (e) {
    // does not have a bower.json manifest
  }
  return _.keys(manifest.dependencies) || [];
}

function getBowerMains(module) {
  function makeMinFileName(file) {
    const env = process.env.NODE_ENV || 'development';
    if (env === 'production') {
      return './bower_components/' + module + '/' + file.substr(0, file.indexOf('.js')) + '.min.js';
    } else {
      return './bower_components/' + module + '/' + file;
    }
  }

  unloadModule('../../bower_components/' + module + '/bower.json');
  var manifest = require('../../bower_components/' + module + '/bower.json');
  if (typeof manifest.main === 'string')
    return [ makeMinFileName(manifest.main) ]
  else
    return _.map(manifest.main, makeMinFileName);
}

function getBowerModule(module) {
  function extractFileWithoutExt(file) {
    var parts = file.split('/');
    file = parts[parts.length - 1];
    return file.substr(0, file.indexOf('.'));
  }

  unloadModule('../../bower_components/' + module + '/bower.json');
  var manifest = require('../../bower_components/' + module + '/bower.json');
  if (typeof manifest.main === 'string')
    return [ extractFileWithoutExt(manifest.main) ];
  else
    return _.map(manifest.main, extractFileWithoutExt);
}

module.exports = {
  getBowerPackageIds,
  getBowerMains,
  getBowerModule
}
