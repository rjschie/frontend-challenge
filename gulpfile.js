
/**
 * Load Plugins
 */
var gulp		= require('gulp');
var del			= require('del');
var plugins	= require('gulp-load-plugins')();
var bs			= require('browser-sync').create();
var htmlInjector = require('bs-html-injector');


/**
 * Usefuls
 */
var config = {
	path : {
		root	: 'src',
		css		: 'src/css',
		js		: 'src/js',
		assets: 'src/assets'
	}
};

function errorOutput(error) {
	plugins.util.log("Error ( " + error.plugin + " ): " + error.message);
	this.emit('end');
}


/**
 * Development Tasks
 */
gulp.task('css', function() {
	return gulp.src(config.path.css + '/combined.scss')
		.pipe(plugins.sourcemaps.init())
			.pipe(plugins.sass({ outputStyle: 'compressed' })
				.on('error', errorOutput))
			.pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8',
				'ie 9', 'opera 12.1')
				.on('error', errorOutput))
		.pipe(plugins.sourcemaps.write())
		.pipe(gulp.dest(config.path.css)
			.on('error', errorOutput))
		.pipe(bs.stream());
});



gulp.task('js', function() {
	return gulp.src(config.path.js + '/all.js')
		.pipe(plugins.include())
		.pipe(plugins.sourcemaps.init())
			.pipe(plugins.concat('app.js')
				.on('error', errorOutput))
			.pipe(plugins.uglify()
				.on('error', errorOutput))
		.pipe(plugins.sourcemaps.write())
		.pipe(gulp.dest(config.path.js)
			.on('error', errorOutput));
});



gulp.task('sprites', function() {
	return gulp.src(config.path.assets + '/svg/separate/*.svg')
		.pipe(plugins.svgSprite(
		{
			shape: {
				dimension: {
					maxWidth: 100,
					maxHeight: 100
				}
			},
			// svg: {
			// 	transform: [
			// 		function(svg) {
			// 			svg = svg.replace(/<g\s.+?>|<\/g>/g, '');
			// 			svg = svg.replace(/fill=".+?"/g, '');
			// 			svg = svg.replace(/stroke=".+?"/g, '');
			// 			return svg;
			// 		}
			// 	]
			// },
			mode: {
				symbol: {
					dest: '.',
					sprite: 'sprite.svg',
					inline: true
				}
			}
		}).on('error', errorOutput))
		.pipe(gulp.dest(config.path.assets + '/svg'));
});



gulp.task('images', function() {
	return gulp.src(config.path.assets + '/imgs/**/*')
		.pipe(plugins.imagemin({
			optimizationLevel: 7
		}))
		.pipe(gulp.dest(config.path.assets + '/imgs'));
});



/**
 * Watching
 */
gulp.task('watch', function() {
	bs.use(htmlInjector, {
		files: config.path.root + '/**/*.html'
	});
	bs.init({
		server: {
			baseDir: './src'
		},
		open: false
	});

	gulp.watch(config.path.root + '/**/*.html')
		.on('change', htmlInjector)
		.on('error',errorOutput);
	gulp.watch(config.path.root + '/**/*.js', ['js'])
		.on('change', bs.reload)
		.on('error',errorOutput);
	gulp.watch(config.path.root + '/**/*.scss', ['css'])
		.on('error',errorOutput);
});



/**
 * Command Liners
 */
gulp.task('default', ['css', 'js', 'watch']);
gulp.task('all', ['css', 'js', 'sprites', 'images']);
