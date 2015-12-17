module.exports = function(grunt){
	
	grunt.initConfig({
	    
		nodemon: {
			dev: {
				script: 'bin/www'
			}
		},
		
		jshint: {
			all: ['Gruntfile.js',
			'MongoModels/*.js',
			'routes/**/*.js',
			'frontEnd/js/controller.js',
			'frontEnd/js/controller.js',
			'frontEnd/js/main.js',
			'frontEnd/js/meal.js',
			'frontEnd/js/script.js',
			'frontEnd/js/shoppingCart.js',
			'frontEnd/js/store.js']
		}

	});	


	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	
	grunt.registerTask('default', ['nodemon']);
};