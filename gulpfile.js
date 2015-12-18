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
      files: ['public/**/*.*','./views/*'],
      notify: false,
      proxy: 'https://localhost:3000',
      port: 4000,
  }), 550);
});

gulp.task('watchGO',['runGo'], () => gulp.watch(["./*.go", "./**/*.go"]).on("change", () => go.restart()));

gulp.task('default',['browser-sync','watchGO']);
