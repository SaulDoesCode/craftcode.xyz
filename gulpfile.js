var go,
gulp = require('gulp'),
gulpgo = require('gulp-go'),
browserSync = require('browser-sync');

gulp.task("runGo", () => {
  go = gulpgo.run("craftcode.go", {
    cwd: __dirname,
    stdio: 'inherit'
  })
});

gulp.task('browser-sync', () => {

  browserSync.reload({
    stream: false
  });
  setTimeout(() => browserSync.init({
      // watch the following files; changes will be injected (css & images) or cause browser to refresh
      files: ['public/**/*.*'],
      notify: false,
      // informs browser-sync to proxy our expressjs app which would run at the following location
      proxy: 'http://localhost:3000',
      // notice that the default port is 3000, which would clash with our Golang server
      port: 4000,
    }), 550);
});


gulp.task('watchGO',['runGo'], () => gulp.watch(["./*.go", "./**/*.go"]).on("change", () => go.restart()));
gulp.task('watchSource', () => gulp.watch(["./public/*", "./public/**/*" , './views/*'],['browser-sync']));

gulp.task('default',['browser-sync','watchGO','watchSource']);
