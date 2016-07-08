var gulp = require('gulp');
var babel = require('gulp-babel');
const clean = require('gulp-clean');
const nodemon = require('gulp-nodemon');
const exec = require('child_process').exec

gulp.task('default', ['clean', 'copy', 'babelify', 'dev'], () => {
  
});

gulp.task('copy', ['clean'], () => {
  return gulp.src(['src/**/*.html' ,'src/**/*.css', 'src/**/*.eot', 'src/**/*.svg', 'src/**/*.tff', 'src/**/*.wof*'])
    .pipe(gulp.dest('dist/'));
});

gulp.task('babelify', ['clean'], () => {
  return gulp.src('src/**/*.js')
    .pipe(babel( { presets: ['es2015'] }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('clean', () => {
  return gulp.src('dist/', { read: false })
    .pipe(clean());
});

gulp.task('dev', ['clean', 'copy', 'babelify'], () => {
  nodemon({
    script: 'dist/server.js',
    ext: 'js html css',
    ignore: ['dist'],
    tasks: ['clean', 'copy', 'babelify']
  });
});

gulp.task('prod', ['clean', 'copy', 'babelify'], () => {

});