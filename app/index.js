'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');

    this.appname = path.basename(process.cwd());
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('Interactive Template Generator (AU)') + ' generator!'
    ));

    var prompts = [{
        type: 'input',
        name: 'githubUserName',
        message: 'Please eneter you github username?',
        store   : true
      },{
        type: 'input',
        name: 's3Path',
        message: 'Please the s3 path on interactive?',
        store   : true
      }];

    this.prompt(prompts, function (props) {
      this.githubUserName = props.githubUserName;
      this.s3Path = props.s3Path;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.copy('gitignore', '.gitignore');
      this.copy('jshintrc', '.jshintrc');
      this.copy('sauce_labs_capabilities.js', 'sauce_labs_capabilities.js');
      this.copy('travis.yml', '.travis.yml');
      this.copy('karma.conf.js', '.karma.conf.js');
      this.directory('src', 'src');
      this.directory('test', 'test');

      var context = { 
        repo: this.appname,
        user: this.githubUserName,
        path: this.s3Path
      };

      this.template('bower.json', 'bower.json', context);
      this.template('src/index.html', 'src/index.html', context);
      this.template('gulpfile.js', 'gulpfile.js', context);
      this.template('README.md', 'README.md', context);
      this.template('package.json', 'package.json', context);
      this.spawnCommand('git', ['init']);
    },
  },

  install: function () {
    this.spawnCommand('git', ['add', '.']);
    this.npmInstall();
  },
  end: function () {
    this.spawnCommand('git', ['commit', '-am', '"Initial commit"']);
    this.spawnCommand('jspm', ['install', '-y']);
    this.spawnCommand('bower', ['install', '-y']);
  }
});
