const gulp = require( 'gulp' );
const clean = require( 'gulp-clean' );
const postcss = require( 'gulp-postcss' );
const cssnano = require('cssnano'); // minify css
const htmlmin = require('gulp-htmlmin');  // minify html
const minify = require('gulp-minify'); // minify JS

// Delete files from previous build - except images, fonts
gulp.task( 'clean', function () {
    return gulp.src( ['build/css', 'build/html', 'build/js'], {
            read: false
        } )
        .pipe( clean() );
} );

/* Minify css */
gulp.task('css', [ 'clean' ], function () {
    var plugins = [
        cssnano()
    ];
    return gulp.src('./src/css/*.css')
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./build/css/'));
});

/* Minify html */
gulp.task('html', [ 'css' ], function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./build/'));
});

/* Minify JS and save uncompressed files with -debug.js */
gulp.task('js', [ 'html' ], function() {
  gulp.src('./src/js/*.js')
    .pipe(minify({
        ext:{
            src:'-debug.js',
            min:'.js'
        },
        //exclude: ['tasks'],
        //ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest('./build/js/'));
});

gulp.task( 'watch', function () {
    gulp.watch( 'src/**/*.*', [ 'default' ] );
} );

gulp.task( 'default', [ 'js' ] );
