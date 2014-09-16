module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON( 'package.json' ),
    
    emberTemplates: {
      compile: {
        options: {
          templateBasePath: /app\/templates\//
        },
        files: {
          'app/templates.js': 'app/templates/*.hbs'
        }
      }
    },

    watch: {
      emberTemplates: {
        files: 'app/templates/*.hbs',
        tasks: ['emberTemplates']
      },
      js:{
        files: ['app/controllers/*.js',
            'app/routes/*.js',
            'app/models/*.js',
            'app/fixtures.js',
            'app/views/*.js',
            'app/router.js',
            'app/templates.js',
            'app/main.js'],
        tasks: ['uglify']
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        mangle: false,
        beautify: true
      },
      build: {
        src: [
//            'libs/jquery/dist/jquery.min.js',
//            'libs/bootstrap/dist/js/bootstrap.min.js', 
//            'libs/handlebars/handlebars.runtime.min.js', 
//            'libs/ember/ember.min.js',
//            'libs/ember-data/ember-data.min.js', 
//            'libs/d3/d3.min.js', 
            'app/main.js', 
            'app/templates.js', 
            'app/models/*.js', 
            'app/controllers/*.js', 
            'app/router.js',
            'app/fixtures.js',
            'app/routes/*.js',
            'app/views/*.js'],
        dest: 'app/app.min.js'
      }
    }
  });
 
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ember-templates');
  grunt.loadNpmTasks('grunt-contrib-uglify');
 
  // Default task(s).
  grunt.registerTask('default', ['emberTemplates','uglify','watch']);
};