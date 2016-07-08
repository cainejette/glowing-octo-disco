var gulp = require('gulp');
const nodemon = require('gulp-nodemon');

gulp.task('default', ['dev'], () => {
});

gulp.task('dev', [], () => {
  nodemon({
    script: 'src/server.js',
    ext: 'js html css',
  });
});
