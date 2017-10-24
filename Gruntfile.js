module.exports = function (grunt) {
	'use strict';

	// Configuration
	grunt.initConfig({
		sass: {
			dev: {
				options: {
					style: 'expanded'
				},
				files: {
					'css/main.css': 'scss/main.scss'
				}
			},
			dist: {
				options: {
					style: 'compressed'
				},
				files: {
					'css/main.min.css': 'scss/main.scss'
				}
			}
		},
		watch: {
			sass: {
				files: ['scss/**/*.scss'],
				tasks: ['sass:dev'],
				options: {
					spawn: false,
					atBegin: true
				}
			}
		}
	});

	// Tasks
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['sass:dist']);
};
