var _ = require('lodash');
var path = require('path');
var yeoman = require('yeoman-generator');

var variables = {
  appname: null,
  version: null,
  react_version: '^15.1.0',
}

module.exports = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);
    this.argument('appname', { type: String, required: true });
    this.option('version', { type: String, required: false, defaults: '0.0.1' });
  },

  configuring: {
    gatherVariables: function() {
      variables.appname = this.appname;
      variables.version = this.options.version;
    }
  },

  writing: {
    createProjectFiles: function() {
      this._copy('package.json');
      this._copy('gulpfile.js');
      this._copy('bower.json');
      this._copy('.babelrc');
      this._copy('.gitignore');
    },

    createApplicationFiles: function() {
      this._copy('src/main/index.html');
      this._copy('src/main/index.js');
    }
  },

  install: function() {
    this.npmInstall();
  },

  _copy: function(file) {
    this.fs.copyTpl(this.templatePath(file), this.destinationPath(file), variables);
  }
});
