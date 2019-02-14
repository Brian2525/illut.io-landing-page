const gulp = require( 'gulp' );
const del = require( 'del' );
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const babel = require("gulp-babel");
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const browserSync = require( 'browser-sync' ).create();

gulp.task( 'css', function() {
    del.sync([ './build/assets/css' ]);

    return gulp.src( './src/assets/css/**/*.css' )
        .pipe( sourcemaps.init() )
        .pipe( cssnano() )
        .pipe( sourcemaps.write( '.' ) )
        .pipe( gulp.dest( './build/assets/css' ) );
});

gulp.task( 'js', function() {
    del.sync([ './build/assets/js' ]);

    return gulp.src( './src/assets/js/**/*.js' )
        .pipe( sourcemaps.init() )
        .pipe( babel({ presets: [ '@babel/env' ] }) )
        .pipe( uglify() )
        .pipe( concat( 'main.js' ) )
        .pipe( sourcemaps.write( '.' ) )
        .pipe( gulp.dest( './build/assets/js' ) );
});

gulp.task( 'img', function() {
    del.sync([ './build/assets/img' ]);

    return gulp.src( './src/assets/img/**/*.{png,jpg,jpeg,gif,svg}' )
        .pipe( imagemin({ verbose: true }) )
        .pipe( gulp.dest( './build/assets/img' ) );
});

gulp.task( 'html', function() {
    del.sync([ './build/*.html', './build/assets/**/*.html', '!./build/assets' ]);

    return gulp.src( [ './src/*.html', './src/assets/**/*.html' ] )
        .pipe( htmlmin({ collapseWhitespace: true, removeComments: true }) )
        .pipe( gulp.dest( './build' ) );
});

gulp.task( 'build', gulp.parallel( 'css', 'js', 'img', 'html' ) );

gulp.task( 'watch', function() {
    gulp.series( 'build', 'serve' )();

    gulp.watch( './src/assets/css/**/*.css', gulp.series( 'css' ) );
    gulp.watch( './src/assets/js/**/*.js', gulp.series( 'js' ) );
    gulp.watch( './src/assets/img/**/*.{png,jpg,jpeg,gif,svg}', gulp.series( 'img' ) );
    gulp.watch( [ './src/*.html', './src/assets/**/*.html' ], gulp.series( 'html' ) );
});

gulp.task( 'serve', function() {
    browserSync.init({
        server: './build'
    });

    gulp.watch( './build' ).on( 'change', browserSync.reload );
});
