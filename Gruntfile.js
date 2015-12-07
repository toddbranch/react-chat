module.exports = function(grunt) {
  grunt.initConfig({
    jscs: {
      src: [
        'store.js',
        'store_spec.js',
        'Gruntfile.js'
      ],
      options: {
        config: '.jscsrc'
      }
    },
    jasmine: {
      src: 'store.js',
      options: {
        keepRunner: true,
        vendor: [
          'node_modules/react/dist/react.js',
          'node_modules/react-dom/dist/react-dom.js',
          'node_modules/redux/dist/redux.js',
          'node_modules/underscore/underscore.js'
        ],
        specs: 'store_spec.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-jscs');

  grunt.registerTask('default', ['jscs', 'jasmine']);
};
