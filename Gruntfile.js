module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-html2js');

	var config = {

		/**
		 *	Directories
		 */
		
		source_dir: 'src',
		build_dir: 'dist',
		example_dir: 'example',
		scss_dir: '<%= source_dir %>/example/scss',
		js_dir: '<%= source_dir %>',
		templates_dir: '<%= source_dir %>',

		pkg: grunt.file.readJSON("package.json"),

		/** 
		 *	Task configurations
		 */

		// Clean build directory.
		clean: {
			dist: {
				src: ['<%= build_dir %>']
			},
			example: {
				src: [
					'<%= example_dir %>/*.min.js',
					'<%= example_dir %>/*.map',
					'<%= example_dir %>/*.css'
				]
			}
		},

		// Bake HTML templates to angular template cache.
		html2js: {
			options: {
				base: '<%= templates_dir %>',
				module: 'AngularCustomizableDropdown',
				existingModule: true,
				singleModule: true,
				useStrict: true,
				htmlmin: {
					collapseBooleanAttributes: true,
					collapseWhitespace: true,
					removeComments: true
				}
			},
			templates: {
				src: ['<%= templates_dir %>/**/*.html'],
				dest: '<%= js_dir %>/generated/templates.js'
			}
		},

		// Combine and uglify to a single js file.
		uglify: {
			dist: {
				options: {
					sourceMap: true
				},
				files: {
					'<%= build_dir %>/ac-dropdown.min.js' : ['<%= js_dir %>/*.js', '<%= js_dir %>/generated/*.js'],
					'<%= example_dir %>/ac-dropdown.min.js' : ['<%= js_dir %>/*.js', '<%= js_dir %>/generated/*.js'],
				}
			},
			develop: {
				options: {
					sourceMap: true,
					mangle: false,
					compress: false
				},
				files: {
					'<%= example_dir %>/ac-dropdown.min.js' : ['<%= js_dir %>/*.js', '<%= js_dir %>/generated/*.js'],
				}
			}
		},

		// Build SCSS to CSS for examples.
		sass: {
			example: {
				files: {
					'<%= example_dir %>/styles.css' : '<%= scss_dir %>/examples.scss'
				}
			}
		},


		// Watch task.
		watch: {
			sass: {
				files: ['<%= scss_dir %>/**/*.scss'],
				tasks: ['sass:example']
			},
			js: {
				files: ['<%= js_dir %>/**/*.js', '!<%= js_dir %>/**/*.spec.js'],
				tasks: ['uglify:develop']
			},
			tpl: {
				files: ['<%= source_dir %>/**/*.html'],
				tasks: ['html2js:templates', 'uglify:develop']
			}
		}
	};

	// TODO: JSHINT!

	grunt.initConfig(config);

	grunt.registerTask('develop', ['clean:dist', 'clean:example', 'sass:example', 'html2js:templates', 'uglify:develop', 'watch']);
	grunt.registerTask('dist', ['clean:dist', 'clean:example', 'sass:example', 'html2js:templates', 'uglify:dist']);
	grunt.registerTask('default', ['dist']);


};