module.exports = function(grunt) {

  'use strict';

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var path = require('path');
  var config = {

    /**
     * Pull in the bower.json file so we can read its metadata.
     */
    pkg: grunt.file.readJSON('bower.json'),
    
    /**
     * Bower: https://github.com/yatskevich/grunt-bower-task
     * 
     * Install Bower packages and migrate static assets.
     */
    bower: {
      install: {
        options: {
          targetDir: './vendor/',
          install: true,
          verbose: true,
          cleanBowerDir: true,
          cleanTargetDir: true,
          layout: function(type, component) {
            if (type === 'img') {
              return path.join('../static/img');
            } else if (type === 'fonts') {
              return path.join('../static/fonts');
            } else {
              return path.join(component);
            }
          }
        }
      }
    },

    /**
     * Concat: https://github.com/gruntjs/grunt-contrib-concat
     * 
     * Concatenate cf-* Less files prior to compiling them.
     */
    concat: {
      'cf-less': {
        src: [
          'vendor/cf-*/*.less',
          '!vendor/cf-core/*.less',
          'vendor/cf-core/cf-core.less',
          '!vendor/cf-concat/cf.less'
        ],
        dest: 'vendor/cf-concat/cf.less',
      },
      bodyScripts: {
        src: [
          'vendor/jquery/jquery.js',
          'vendor/jquery.easing/jquery.easing.js',
          'vendor/cf-*/*.js',
          'vendor/prism/prism.js',
          'static/js/app.js'
        ],
        dest: 'static/js/main.js'
      }
    },

    /**
     * Copy: https://github.com/gruntjs/grunt-contrib-copy
     * 
     * Copy files and folders.
     */
    copy: {
      vendor: {
        files:
        [
          {
            expand: true,
            cwd: '',
            src: [
              // Only include vendor files that we use independently
              'vendor/box-sizing-polyfill/boxsizing.htc'
            ],
            dest: 'static'
          }
        ]
      }
    },

    /**
     * Less: https://github.com/gruntjs/grunt-contrib-less
     * 
     * Compile Less files to CSS.
     */
    less: {
      main: {
        options: {
          paths: grunt.file.expand('vendor/**/'),
        },
        files: {
          'static/css/main.css': ['static/css/main.less']
        }
      }
    },

    /**
     * Autoprefixer: https://github.com/nDmitry/grunt-autoprefixer
     * 
     * Parse CSS and add vendor-prefixed CSS properties using the Can I Use database.
     */
    autoprefixer: {
      options: {
        // Options we might want to enable in the future.
        diff: false,
        map: false
      },
      main: {
        // Prefix `static/css/main.css` and overwrite.
        expand: true,
        src: ['static/css/main.css']
      },
    },

    /**
     * Watch: https://github.com/gruntjs/grunt-contrib-watch
     * 
     * Run predefined tasks whenever watched file patterns are added, changed or deleted.
     * Add files to monitor below.
     */
    watch: {
      css: {
        files: ['static/css/*.less'],
        tasks: ['cssdev']
      },
      js: {
        files: ['static/js/app.js'],
        tasks: ['jsdev']
      }
    },

    docs: {
      main: {
        src: ['static/css/main.css', 'vendor/cf-concat/cf.less'],
        dest: 'static/css/main.json',
        options: {
          mergeProp: 'name'
        }
      }
    }

  };
  grunt.initConfig(config);

  /**
   * comment-docs
   */
  grunt.registerMultiTask( 'docs', 'Parses documentation from code comments.', function() {
    var CommentDocs, docMaker, asyncDone, options;
    asyncDone = this.async();
    options = this.options();
    CommentDocs = require('comment-docs');
    docMaker = new CommentDocs();
    this.files.forEach( function( file ) {
      var docs = docMaker.parse( file.src, options.mergeProp );
      docMaker.writeJSON( docs, file.dest );
      asyncDone();
    });
  });

  /**
   * Create custom task aliases and combinations.
   */
  grunt.registerTask('vendor', ['bower:install', 'concat:cf-less']);
  grunt.registerTask('cssdev', ['less', 'autoprefixer']);
  grunt.registerTask('jsdev', ['concat:bodyScripts']);
  grunt.registerTask('default', ['vendor', 'docs', 'cssdev', 'jsdev', 'copy:vendor']);

};
