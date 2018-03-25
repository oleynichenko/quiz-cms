const gulp = require(`gulp`);
const sass = require(`gulp-sass`);
const plumber = require(`gulp-plumber`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const rollup = require(`gulp-better-rollup`);
const nodemon = require(`gulp-nodemon`);
const server = require(`browser-sync`).create();


gulp.task(`style`, function () {
  gulp.src(`front/sass/style.scss`)
      .pipe(plumber())
      .pipe(sass())
      .pipe(postcss([
        autoprefixer({browsers: [
          `last 1 version`,
          `last 2 Chrome versions`,
          `last 2 Firefox versions`,
          `last 2 Opera versions`,
          `last 2 Edge versions`
        ]})
      ]))
      // .pipe(minify())
      // .pipe(rename(`style.min.css`))
      .pipe(gulp.dest(`static/css`));
      // .pipe(server.stream());
});

gulp.task(`scripts`, function () {
  gulp.src(`front/js/index.js`)
      .pipe(plumber())
      .pipe(rollup({}, `iife`))
      .pipe(gulp.dest(`static/js`));
});

gulp.task(`nodemon`, function (cb) {
  let started = false;

  return nodemon({
    script: `index.js`,
    args: [`--server`],
    ext: `js json pug css`,
    ignore: [
      `node_modules/`,
      `front/*`
    ]
  }).on(`start`, function () {
    if (!started) {
      cb();
      started = true;

      server.init({
        proxy: `localhost:3000`,
        // reloadDelay: 1000,
        port: 8080
      });

      console.log(2222222222222);
    }

    server.reload();
  });
});

gulp.task(`watch`, function () {
  gulp.watch(`front/sass/**/*.scss`, [`style`]);
  gulp.watch(`front/js/**/*.js`, [`scripts`]);
});

gulp.task(`start`, [`watch`, `style`, `scripts`, `nodemon`]);
