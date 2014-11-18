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
          'vendor/angular/angular.js',
          'vendor/angular-sanitize/angular-sanitize.js',
          // 'vendor/jquery/jquery.js',
          // 'vendor/jquery.easing/jquery.easing.js',
          // 'vendor/cf-*/*.js',
          'vendor/highlightjs/highlight.pack.js',
          'static/js/app.js'
        ],
        dest: 'static/js/main.js'
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
     * Text replace: https://www.npmjs.org/package/grunt-text-replace
     */
    replace: {
      topdoc: {
        src: ['static/css/main.css', 'vendor/cf-concat/cf.less'],
        overwrite: true,
        replacements: [{
          from: '/* topdoc',
          to: '/* doxray'
        }]
      }
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

    doxray: {
      main: {
        src: ['static/css/main.css', 'vendor/cf-concat/cf.less'],
        dest: 'static/css/main.json',
        options: {
          merge: true
        }
      }
    }

  };
  grunt.initConfig(config);

  /**
   * Dox-ray task
   */
  grunt.registerMultiTask( 'doxray', 'Parses documentation from code comments.', function() {
    var Doxray, doxray, asyncDone, options;
    asyncDone = this.async();
    options = this.options();
    Doxray = require('dox-ray');
    doxray = new Doxray();
    this.files.forEach( function( file ) {
      var docs = doxray.parse( file.src, options.merge );
      try {
        doxray.writeJSON( docs, file.dest );
        grunt.log.ok( 'Dox-ray succesfully created', file.dest );
        asyncDone();
      } catch ( e ) {
        grunt.log.error( 'Dox-ray could not create', file.dest );
        asyncDone();
      }
    });
  });

  /**
   * Custom task aliases and combinations.
   */
  grunt.registerTask('vendor', ['bower:install', 'concat:cf-less']);
  // Note that since Capital Framework files use Topdoc comments we need to
  // replace the string "topdoc" with "doxray".
  grunt.registerTask('make-docs', ['replace:topdoc', 'doxray:main']);
  grunt.registerTask('cssdev', ['less', 'autoprefixer']);
  grunt.registerTask('jsdev', ['concat:bodyScripts']);
  grunt.registerTask('default', ['cssdev', 'jsdev']);

};
