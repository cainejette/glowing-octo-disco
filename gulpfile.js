var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('default', ['dev'], () => {
});

gulp.task('dev', [], () => {
  nodemon({
    script: 'src/server.js',
    ext: 'js html css',
  });
});
