var gulp = require('gulp-help')(require('gulp'));
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');
var _ = require('lodash');
var stream = require('stream');

var bower = require('./src/build/bower-utils');

console.log(process.env.NODE_ENV);

/**
 * Copy resources (html, css, images)
 */
gulp.task('copy-resources', 'Copy resources to target folder', function() {
  return gulp
    .src([ 'src/main/**/*', '!**/*.js' ], { nodir: true })
    .pipe(plumber({ errorHandler: err => { console.log(err.message); this.emit('end'); } }))
    .pipe(gulp.dest('target'));
});

/**
 * Create vendor bundle from bower components
 */
gulp.task('compile:vendor', 'Create vendor.js with Bower packages', function() {
  var modules = _.flatten(_.map(bower.getBowerPackageIds(), bower.getBowerMains));

  return gulp
    .src(modules)
    .pipe(plumber({ errorHandler: err => { console.log(err.message); this.emit('end'); } }))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('target'));
});

/**
 * Compile application sources
 */
gulp.task('compile:main', 'Create index.js with application content', function() {
  var externals = _.flatten(_.map(bower.getBowerPackageIds(), bower.getBowerModule));
  var isProductionBuild = (process.env.NODE_ENV || 'development') === 'production';
  var stage = gulp
    .src('src/main/index.js')
    .pipe(plumber({ errorHandler: err => { console.log(err.message); this.emit('end'); } }))
    .pipe(browserify({ transform: [ 'babelify' ], external: externals }));
  if (isProductionBuild) {
    stage = stage.pipe(uglify());
  }
  return stage.pipe(gulp.dest('target'));
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
      host      : '0.0.0.0',
      port      : 8000,
      livereload: true,
      open      : true,
      proxies   : [
        // for example to proxy the requests under /api to localhost:3000/api type
        // { source: '/api', target: 'http://localhost:3000/api' }
      ]
    }));
});
