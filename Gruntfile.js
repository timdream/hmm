"use strict";

module.exports = function(grunt) {

    var matchdep = require("matchdep");


    // Configuration
    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),

        name: "<%= pkg.name %>",
        version: "<%= pkg.version %>",


        mainFile: "hmm.js",
        distFile: "hmm.js",

        srcDir: "lib",
        srcFiles: "**/*.js",
        src: "<%= srcDir %>/<%= srcFiles %>",

        destDir: "dist",

        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            gruntfile: {
                src: "Gruntfile.js"
            },
            src: {
                src: ["<%= src %>"]
            },
            test: {
                options: {
                    jshintrc: "test/.jshintrc"
                },
                src: ["test/**/*.js"]
            }
        },






        push: {
            options: {
                files: ["package.json"],
                commitMessage: "Release version %VERSION%",
                commitFiles: ["-a"],
                tagName: "%VERSION%",
                tagMessage: "Version %VERSION%"
            }
        },


        mochacli: {
            all: ["test/**/*.js"]
        }
    });

    // Plugins

    matchdep.filterDev("grunt-*").forEach(grunt.loadNpmTasks);


    // Tasks


    grunt.registerTask("test", ["mochacli"]);
    grunt.registerTask("default", ["jshint", "test"]);
    grunt.registerTask("all", ["default"]);

    grunt.registerTask("release", ["push"]);
    grunt.registerTask("release-minor", ["push:minor"]);
    grunt.registerTask("release-major", ["push:major"]);


    // For Travis CI service
    grunt.registerTask("travis", ["all"]);

};
