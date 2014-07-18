module.exports = function (grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true
      },
      all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js', '!tmp/coverage/**/*.js']
    },

    jsdoc : {
      dist : {
        src: ['lib/**/*.js'],
        options: {
          destination: 'doc'
        }
      }
    },

    clean: {
      coverage: {
        src: ['tmp/coverage/']
      }
    },

    env: {
      coverage: {
        APP_DIR_FOR_CODE_COVERAGE: '../tmp/coverage/instrument/'
      }
    },

    instrument: {
      files: 'lib/**/*.js',
      options: {
        lazy: true,
        basePath: 'tmp/coverage/instrument/'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'dot',
          ui: 'bdd',
          ignoreLeaks: false
        },
        src: ['test/**/*.js', '!tmp/coverage/**/*.js']
      }
    },

    storeCoverage: {
      options: {
        dir: 'tmp/coverage/reports'
      }
    },

    copy: {
      package: {
        src: ['package.json'],
        dest: 'tmp/coverage/instrument/package.json'
      }
    },

    makeReport: {
      src: 'tmp/coverage/reports/**/*.json',
      options: {
        type: 'lcov',
        dir: 'tmp/coverage/htmlReports',
        print: 'detail'
      }
    },

    watch: {
      js: {
        files: [
          '<%= jshint.all %>'
        ],
        tasks: [
          'jshint', 'mochaTest'
        ]
      }
    }
  });

  grunt.registerTask('test', ['jshint', 'mochaTest:test']);

  grunt.registerTask('coverage', ['jshint', 'clean', 'copy:package', 'env:coverage',
    'instrument', 'mochaTest:test', 'storeCoverage', 'makeReport']);

  grunt.registerTask('default', ['watch']);
};
