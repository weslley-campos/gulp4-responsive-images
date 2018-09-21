const { src, dest, series, parallel } = require('gulp')
const os = require('os')
const webp = require('gulp-webp')
const clean = require('gulp-clean')
const rename = require('gulp-rename')
const resize = require('gulp-image-resize')
const parallelCore = require('concurrent-transform')

const config = [{Percent : 25 , resolution: '@460'}, 
                {Percent : 40 , resolution: '@768'}, 
                {Percent : 55 , resolution: '@1024'}, 
                {Percent : 70 , resolution: '@1366'}, 
                {Percent : 100 , resolution:'@1920'}]
    , folder = 'C:\\Zeus\\Sistemas C#\\SiteZeus\\SiteZeus\\SiteZeus\\Content\\img\\slides\\'

function imagesClean() {
    return src([
        folder + "/**/*" + config[0].resolution + ".{jpg,png,webp}",
        folder + "/**/*" + config[1].resolution + ".{jpg,png,webp}",
        folder + "/**/*" + config[2].resolution + ".{jpg,png,webp}",
        folder + "/**/*" + config[3].resolution + ".{jpg,png,webp}",
        folder + "/**/*" + config[4].resolution + ".{jpg,png,webp}",
        folder + "/**/*.webp"
        ])
        .pipe(clean({ force: true }))
}

function webpConvert() {
    return src(folder + "/**/*.{jpg,png}")
        .pipe(webp({
            quality: 100,
            lossless: true
        }))
        .pipe(dest(folder))
}

function imagesResize(percent, suffixResolution) {
    return src(folder + "/**/*.{png,jpg,webp}")
        .pipe(parallelCore(
            resize({
                percentage: percent
            }),
            os.cpus().length
        ))
        .pipe(rename(function (path) {
            path.basename += suffixResolution
        }))
        .pipe(dest(folder))
}

function imageResize25 () {
    return imagesResize(config[0].Percent, config[0].resolution)
}

function imageResize40 () {
    return imagesResize(config[1].Percent, config[1].resolution)
}

function imageResize55 () {
    return imagesResize(config[2].Percent, config[2].resolution)
}

function imageResize70 () {
    return imagesResize(config[3].Percent, config[3].resolution)
}

function imageResize100() {
    return imagesResize(config[4].Percent, config[4].resolution)
}

exports.imageResize25 = imageResize25
exports.imageResize40 = imageResize40
exports.imageResize55 = imageResize55
exports.imageResize70 = imageResize70
exports.imageResize100 = imageResize100
exports.imagesClean = imagesClean
exports.webpConvert = webpConvert
exports.default = series(
    imagesClean, 
    parallel(
        imageResize25, 
        imageResize40, 
        imageResize55, 
        imageResize70, 
        imageResize100),
    webpConvert)
