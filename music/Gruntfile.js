module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    "babel": {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          //compile to: compile from
          "dist/index.js": "index.js",

        }
      }
    }
  });

  grunt.registerTask("default", ["babel"]);
}
