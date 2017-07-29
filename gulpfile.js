var gulp						= require('gulp'),
		sass 						= require('gulp-sass'),
		wait 						= require('gulp-wait'),
		browserSync 		= require('browser-sync'),
		concat					= require('gulp-concat'),
		uglify					= require('gulp-uglifyjs'),
		cssnano					= require('gulp-cssnano'),
		rename					= require('gulp-rename'),
		del							= require('del'),
		imagemin				= require('gulp-imagemin'),
		pngquant				= require('imagemin-pngquant'),
		cache						= require('gulp-cache'),
		autoprefixer		= require('gulp-autoprefixer'),
		spritesmith 		= require('gulp.spritesmith'),
		csscomb 				= require('gulp-csscomb'),
		svgSprite 			= require('gulp-svg-sprite'),
		tingpng 				= require('gulp-tinypng');

// ======================================
// 								SPRITE
// ======================================

// Clean old sprite file
gulp.task('sprite-clean', function() {
	del.sync('app/img/sprite.png');
	del.sync('app/sass/_sprite.sass');
});

// Create new sprite
gulp.task('sprite', ['sprite-clean'], function () {

	var spriteData = gulp.src('app/img/sprite/*.png')
		.pipe(spritesmith({
			imgName: 'sprite.png',
			cssName: '_sprite.sass',
			cssFormat: 'sass',
			cssVarMap: function (sprite) {
				sprite.name = 'icon-' + sprite.name;
			},
			imgPath: '../img/sprite.png'
		}))

	spriteData.img.pipe(gulp.dest('app/img'));
	spriteData.css.pipe(gulp.dest('app/sass'));
});

// Clean old svg sprite file
gulp.task('svgSprite-clean', function() {
	del.sync('app/img/sprite.svg');
	del.sync('app/sass/_sprite.scss');
});

// Config for svg sprite
config            = {
	shape           : {
		dimension     : {         // Set maximum dimensions
			maxWidth    : 32,
			maxHeight   : 32
		},
		spacing       : {         // Add padding
			padding     : 10
		},
	},
	mode            : {
		view          : {         // Activate the «view» mode
			bust        : false,
			sprite:     '../sprite.svg',
			render: {
				scss: {
					dest:   '../../sass/_sprite.scss'
				}
			}
		},
		symbol        : false      // Activate the «symbol» mode
	}
};

// Create new svg sprite
gulp.task('svgSprite',['svgSprite-clean'], function () {
		return gulp.src('app/img/sprite/*.svg')
			.pipe(svgSprite(config))
			.pipe(gulp.dest('app/img'))
 });

// ======================================
// 							SASS/CSS
// ======================================

// SASS task
gulp.task('sass', function() {
	return gulp.src('app/sass/*.sass')
	.pipe(wait(100))
	.pipe(sass({outputStyle: 'expanded'})
	.on('error',sass.logError))
	.pipe(autoprefixer(['last 15 versions'],{cascade: true}))
	.pipe(concat('main.css'))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}))
});

// CSS libs
gulp.task('css-libs', function() {
	return gulp.src(['app/libs/boostrap-grid/grid.css','app/libs/owl.carousel/dist/assets/owl.carousel.css'])
	.pipe(gulp.dest('app/css'));
});

// ======================================
// 						  JAVA_SCRIPTE
// ======================================

// JS libs
gulp.task('js-libs', function() {
	return gulp.src(['app/libs/jquery/dist/jquery.js','app/libs/owl.carousel/dist/owl.carousel.js', 'app/libs/jQuery-viewport-checker/dist/jquery.viewportchecker.min.js'])
	.pipe(concat('libs.js'))
	.pipe(gulp.dest('app/js'));
});

// JS task
gulp.task('scripts',['js-libs'], function() {
	return gulp.src(['app/js/libs.js', 'app/js/common.js'])
	.pipe(concat('main.js'))
	.pipe(gulp.dest('app/js'));
});

// ======================================
// 						IMAGE MINIFY
// ======================================

// Img min task
gulp.task('img', function() {
	return gulp.src('app/img/**/*')
	.pipe(tingpng('ZVCqme6au-HdchF4ArqTYhg7Wp2vHi5u'))
	.pipe(gulp.dest('dist/img'))
});

// ======================================
// 						BROWSER_SYNC
// ======================================

// Browser-sync task
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'alex'
		},
		notify: false
	});
});

// ======================================
// 								GULP RUN
// ======================================

// Watcher task
gulp.task('run',['browser-sync'], function() {

	gulp.watch('alex/*.html', browserSync.reload);
	gulp.watch('alex/*.js', browserSync.reload);
});

// ======================================
// 				 PRODACTION VESRION BUILD
// ======================================

// Build prodaction version task
gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {

	var buildCss = gulp.src('app/css/*.css')
		.pipe(concat('main.css'))
		.pipe(csscomb())
		.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/font/**/*')
		.pipe(gulp.dest('dist/font'))

	var buildJs = gulp.src(['app/js/main.js'])
		.pipe(concat('main.js'))
		.pipe(uglify('main.js'))
		.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src('app/*.html')
		.pipe(gulp.dest('dist'))

	var buildPhp = gulp.src('app/*.php')
		.pipe(gulp.dest('dist'))
});

// Clean derectory task
gulp.task('clean', function() {
	return del.sync(['dist/css','dist/js','dist/font','dist/*.html','dist/*.php']);
});

// Clear cache task
gulp.task('clear', function() {
	return cache.clearAll();
});