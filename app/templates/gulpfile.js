var gulp = require('gulp-help')(require('gulp'));
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var browserify = require('gulp-browserify');
var webserver = require('gulp-webserver');
var _ = require('lodash');

function unloadModule(module) {
  var name = require.resolve(module);
  delete require.cache[name];
}

/**
 * Copy resources (html, css, images)
 */
gulp.task('copy-resources', 'Copy resources to target folder', function() {
  return gulp
    .src([ 'src/main/**/*', '!**/*.js' ], { nodir: true })
    .pipe(plumber({ errorHandler: err => { console.log(err.message); this.emit('end'); } }))
    .pipe(gulp.dest('target'));
});

function getBowerPackageIds() {
  var bowerManifest = {};
  try {
    unloadModule('./bower.json');
    manifest = require('./bower.json');
  } catch (e) {
    // does not have a bower.json manifest
  }
  return _.keys(manifest.dependencies) || [];
}

function getBowerMains(module) {
  function makeMinFileName(file) {
    return './bower_components/' + module + '/' + file.substr(0, file.indexOf('.js')) + '.min.js';
  }

  unloadModule('./bower_components/' + module + '/bower.json');
  var manifest = require('./bower_components/' + module + '/bower.json');
  if (typeof manifest.main === 'string') 
    return [ makeMinFileName(manifest.main) ]
  else
    return _.map(manifest.main, makeMinFileName);
}

/**
 * Create vendor bundle from bower components
 */
gulp.task('compile:vendor', 'Create vendor.js with Bower packages', function() {
  var modules = _.flatten(_.map(getBowerPackageIds(), getBowerMains));

  return gulp
    .src(modules)
    .pipe(plumber({ errorHandler: err => { console.log(err.message); this.emit('end'); } }))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('target'));
});

function getBowerModule(module) {
  function extractFileWithoutExt(file) {
    var parts = file.split('/');
    file = parts[parts.length - 1];
    return file.substr(0, file.indexOf('.'));
  }

  unloadModule('./bower_components/' + module + '/bower.json');
  var manifest = require('./bower_components/' + module + '/bower.json');
  if (typeof manifest.main === 'string')
    return [ extractFileWithoutExt(manifest.main) ];
  else
    return _.map(manifest.main, extractFileWithoutExt);
}

/**
 * Compile application sources
 */
gulp.task('compile:main', 'Create index.js with application content', function() {
  var externals = _.flatten(_.map(getBowerPackageIds(), getBowerModule));
  return gulp
    .src('src/main/index.js')
    .pipe(plumber({ errorHandler: err => { console.log(err.message); this.emit('end'); } }))
    .pipe(browserify({ transform: [ 'babelify' ], external: externals }))
    .pipe(gulp.dest('target'));
});

/**
 * Compile the application from resources, vendor bundles and application sources
 */
gulp.task('compile', 'Compile everything', [ 'copy-resources', 'compile:vendor', 'compile:main' ]);

/**
 * Watch for changes and recompile
 */
gulp.task('watch', 'Watch for file changes and execute appropriate task when changes are detected', [ 'compile' ], function() {
  gulp.watch([ 'src/main/**/*', '!**/*.js' ], [ 'copy-resources' ]);
  gulp.watch('src/main/**/*.js', [ 'compile:main' ]);
  gulp.watch('bower.json', [ 'compile:vendor' ]);
});

/**
 * Simple server with live reload for development
 */
gulp.task('server', 'Start embedded server for development', [ 'watch' ], function() {
  gulp
    .src('target')
    .pipe(plumber({ errorHandler: err => { console.log(err.message); this.emit('end'); } }))
    .pipe(webserver({
      port      : 8000,
      livereload: true,
      open      : true,
      proxies   : [
        // for example to proxy the requests under /api to localhost:3000/api type
        // { source: '/api', target: 'http://localhost:3000/api' }
      ]
    }));
});
