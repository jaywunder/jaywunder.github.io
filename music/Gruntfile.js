module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    "babel": {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          "js/main.js": "main.js"
        }
      }
    }
  });

  grunt.registerTask("babel", ["babel"]);
}
