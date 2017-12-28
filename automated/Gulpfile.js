const gulp = require( 'gulp' );
const concat = require( 'gulp-concat' );
const notify = require( 'gulp-notify' );
const autoprefixer = require( 'gulp-autoprefixer' );
const clean = require( 'gulp-clean' );
const postcss = require( 'gulp-postcss' );
const uncss = require( 'postcss-uncss' );
const cleanCSS = require( 'gulp-clean-css' );
const cssnano = require('cssnano'); // minify css
const htmlmin = require('gulp-htmlmin');  // minify html
const minify = require('gulp-minify'); // minify JS


// Delete files from previous build - except images
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

/* Remove unnecessary CSS */
gulp.task( 'uncss', [ '' ], function () {
    var plugins = [
        uncss( {
            ignore: [ '.d-sm-none', 'd-none' ],
            html: [
                'https://www.dyke.tech',
                'https://www.dyke.tech/about-the-project/',
                'https://www.dyke.tech/test/level01-9975280837471640/',
                'https://www.dyke.tech/test/level02-9975280837471640/',
                'https://www.dyke.tech/test/level03-1209727801221852/',
                'https://www.dyke.tech/test/level04-9524899478481156/',
                'https://www.dyke.tech/test/level05-4660713596510384/',
                'https://www.dyke.tech/test/level06-8144268725364694/',
                'https://www.dyke.tech/test/level07-7527242469338731/',
                'https://www.dyke.tech/test/level08-4410436090367158/',
                'https://www.dyke.tech/test/level09-4323816127150111/',
                'https://www.dyke.tech/certificate/',
            ]
        } ),
    ];
    return gulp.src( './src/assets/css/bootstrap.min.css' )
        .pipe( postcss( plugins ) )
        .pipe( gulp.dest( './src/assets/css/uncss' ) );
} );

// Create syle.css files by joining all created files
gulp.task( 'cssss', [ 'uncss' ], function () {
    return gulp.src( [
            './src/assets/css/lezba/style.css',
            './src/assets/css/uncss/bootstrap.min.css',
            './src/assets/css/imports/scss.css',
            './src/assets/css/imports/styl-lezba.css'
        ] )
        .pipe( concat( 'style.css' ) )
        //.pipe( autoprefixer( 'last 2 version') )
        .pipe( gulp.dest( './lezba/' ) );
} );

gulp.task( 'watch', function () {
    gulp.watch( 'src/**/*.*', [ 'default' ] );
} );

gulp.task( 'default', [ 'js' ] );
