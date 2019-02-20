let puppeteerMaster = require('./puppeteer_server');
let url_grabber = require('./url_grabber');
let mongoConnect = require('./mongoconnect');
let fs = require('fs');

const pictureFolder = './pictures';

let pictures = fs.readdir(pictureFolder, (err, files) => {
    if (err) {
        console.log(err);
    }
})
