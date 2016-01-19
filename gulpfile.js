let gulp = require('gulp'),
browserSync = require('browser-sync');


gulp.task('browser-sync', () => {

  browserSync.reload({
    stream: false
  });
  setTimeout(() => browserSync.init({
      files: ['public/**/*.*','./views/*'],
      notify: false,
      proxy: 'https://localhost:3000',
      port: 4000,
  }), 550);
});


gulp.task('default',['browser-sync']);
