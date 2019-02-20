// this is the server file for the demo!


const puppeteer = require('puppeteer');
const util = require('util');
const fs = require('fs');
// const mongoConnect = require('./mongoconnect');


// game plan:
// 1: instead of saving to a flat array, create/check an object
// split url by forward slash, check if that portion of the
// object exists, if not, create it. (check!)
// 2: separate these into two files maybe? one for the "getting" (maybe save to json file for now) and one for the crawling (check!)
// 3: time stamp the file name or folder?
// 4: implement try/catch in upper function
// 4: still discussing this "series.json" business
// 3: be able to truly handle errors - throwing, catching, all that
// 5: 'actually crawling' - the homepage, get every link, compile objectify, compile etc
// 6: MongoDb functionality (check!)
// 7: lightweight angular UI to display photos (as they appear?) (check!)
// ---------------------------------------- url looper ----------------------------------------------------

// in case you forget: for some reason, puppeteer seems to have trouble when the url contains a '/' at 
// the end - include a check for last character in string


async function getUrlObj(region, mobile) {

    // objectFromMongo
    let arrayFromUrlObject = (obj, str, arr) => {
        let myAccumulator = arr;
        for (key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue;
            };
            // let currentUrl = Object.getOwnPropertyNames(obj); // this is not being used... why? what? 
            let nextString = str + "/" + key;
            if(str == "") {
                nextString = nextString.substring(1);
            }
            let regex = /_-_-z-_-_/g;
            nextString = nextString.replace(regex, ".");

            if(typeof obj[key] == 'object') {
                myAccumulator.push(nextString);
            }
            arrayFromUrlObject(obj[key], nextString, myAccumulator);
        }
        return myAccumulator;
    }

    let connectCallback = (x, mongoConnection) => { // separated - grabs urls from mongo
        let urlsArray = arrayFromUrlObject(x, "", []);
        mongoConnection.close();
        console.log('closed the db relationship');
        launchPuppeteer(urlsArray, "https://www.buyatoyota.com", "denver", mobile);
    }

    // let UrlObj = mongoConnect.retrieveUrlObj({}, 'greaterny', connectCallback); ///!!!!!!!!!!!!!!!!!!!!!!!
    
    // in the event you wanna re-pull json:
    let otherUrlObj = fs.readFile('combined_array.json', 'utf8', function read(err, data) { // used to be generic, but....
         if (err) {
             throw err;
         }
         console.log(data);
         let content = JSON.parse(data);
        //let arrayifiedUrlObj = arrayFromUrlObject(content, "", []);
        // return content;
        // return arrayifiedUrlObj;
        //launchPuppeteer(arrayifiedUrlObj, "https://www.buyatoyota.com/greaterny/");
        //launchPuppeteer(content.urls, "https://www.buyatoyota.com", "denver");
        launchPuppeteer(content.urls, "https://www.buyatoyota.com", region);
                                                 // ^^ we can genericize this later ^^
    })
}


async function launchPuppeteer(urls, mainUrl, region, mobileYes) {
    let browser = await puppeteer.launch(
        { headless: false }  // included in the event we want to watch the action!
        );
    let page = await browser.newPage();


// ---------------------------------------------------    mobile    ---------------------------------------------------

    if (mobileYes) {
        await page.setViewport({
            // width: 1080,
            // height: 1920,
            width: 375,
            height: 812,
            // width: parseInt(375),
            // height: parseInt(812),
            isMobile: true,
            hasTouch: true,
            deviceScaleFactor: 2
          });
    }



// ---------------------------------------------------    mobile    ---------------------------------------------------

    // page.on('dialog', async dialog => { // dunno if we'll ever need this
    //     await dialog.dismiss();
    // })


    for(let i=0; i < urls.length; i++) {
        try {
            await page.goto((mainUrl + "/" + region + "/" + urls[i]), {waitUntil: 'networkidle0'}); // look out! this is the old way!
            // await page.goto((urls[i]), {waitUntil: 'networkidle0'});

            console.log('we went to the url!');
            let currentUrl = urls[i];

            
            if(currentUrl[0] == '_') {currentUrl = currentUrl.substring(1)}; // cleaning up filepath string
            if(currentUrl[-1] == "_") {currentUrl = currentUrl.substring(0, currentUrl.length - 1)}; // cleaning up filepath string
            // mobile:
            if (mobileYes) {
                currentUrl = "mobile_" + currentUrl.replace(/\//gi, '_').replace(/\-/gi, '_').replace(/\./gi, '_') + '.png'; 
            } else {
            // currentUrl = "mobile_" + currentUrl.replace(/\//gi, '_').replace(/\-/gi, '_').replace(/\./gi, '_') + '.png'; 
            // desktop:
                currentUrl = currentUrl.replace(/\//gi, '_').replace(/\-/gi, '_').replace(/\./gi, '_') + '.png';
            }
            await page.screenshot({
                // path: "./test_now/" + currentUrl,
                path: "./src/assets/demotest/" + currentUrl,

                // path: "./src/assets/" + region + '/' + currentUrl,
                fullPage: true,
            })
            console.log("number " + i + " is done.");
        } catch(err) {
            console.log(err);
        }
    }
    await browser.close();
}



// gets obj from Mongo:
// getUrlObj();

// ---------------------------------------- url looper ----------------------------------------------------

// urlGrabber.grabUrlsFromSiteMap("greaterny");



// let testNowArray = [
//     // 1
//     "https://www.buyatoyota.com/greaterny/offers/86",
//     "https://www.buyatoyota.com/greaterny/offers/avalon",
//     "https://www.buyatoyota.com/greaterny/offers/camry",
//     "https://www.buyatoyota.com/greaterny/offers/corolla",
//     "https://www.buyatoyota.com/greaterny/offers/corollahatchback",
//     "https://www.buyatoyota.com/greaterny/offers/sienna",
//     "https://www.buyatoyota.com/greaterny/offers/yaris",
//     "https://www.buyatoyota.com/greaterny/offers/yarisliftback",
//     "https://www.buyatoyota.com/greaterny/offers/tacoma",
//     "https://www.buyatoyota.com/greaterny/offers/tundra",
//     "https://www.buyatoyota.com/greaterny/offers/4runner",
//     "https://www.buyatoyota.com/greaterny/offers/c-hr",
//     "https://www.buyatoyota.com/greaterny/offers/highlander",
//     "https://www.buyatoyota.com/greaterny/offers/landcruiser",
//     "https://www.buyatoyota.com/greaterny/offers/rav4",
//     "https://www.buyatoyota.com/greaterny/offers/sequoia",
//     "https://www.buyatoyota.com/greaterny/offers/avalonhybrid",
//     "https://www.buyatoyota.com/greaterny/offers/camryhybrid",
//     "https://www.buyatoyota.com/greaterny/offers/highlanderhybrid",
//     "https://www.buyatoyota.com/greaterny/offers/prius",
//     "https://www.buyatoyota.com/greaterny/offers/priusprime",
//     "https://www.buyatoyota.com/greaterny/offers/priusc",
//     "https://www.buyatoyota.com/greaterny/offers/rav4hybrid",
//     "https://www.buyatoyota.com/greaterny/offers/corollaim",
//     "https://www.buyatoyota.com/greaterny/offers/yarisia",
//     // 2
//     "https://www.buyatoyota.com/denver/offers/86",
//     "https://www.buyatoyota.com/denver/offers/avalon",
//     "https://www.buyatoyota.com/denver/offers/camry",
//     "https://www.buyatoyota.com/denver/offers/corolla",
//     "https://www.buyatoyota.com/denver/offers/corollahatchback",
//     "https://www.buyatoyota.com/denver/offers/sienna",
//     "https://www.buyatoyota.com/denver/offers/yaris",
//     "https://www.buyatoyota.com/denver/offers/yarisliftback",
//     "https://www.buyatoyota.com/denver/offers/tacoma",
//     "https://www.buyatoyota.com/denver/offers/tundra",
//     "https://www.buyatoyota.com/denver/offers/4runner",
//     "https://www.buyatoyota.com/denver/offers/c-hr",
//     "https://www.buyatoyota.com/denver/offers/highlander",
//     "https://www.buyatoyota.com/denver/offers/landcruiser",
//     "https://www.buyatoyota.com/denver/offers/rav4",
//     "https://www.buyatoyota.com/denver/offers/sequoia",
//     "https://www.buyatoyota.com/denver/offers/avalonhybrid",
//     "https://www.buyatoyota.com/denver/offers/camryhybrid",
//     "https://www.buyatoyota.com/denver/offers/highlanderhybrid",
//     "https://www.buyatoyota.com/denver/offers/prius",
//     "https://www.buyatoyota.com/denver/offers/priusprime",
//     "https://www.buyatoyota.com/denver/offers/priusc",
//     "https://www.buyatoyota.com/denver/offers/rav4hybrid",
//     "https://www.buyatoyota.com/denver/offers/corollaim",
//     "https://www.buyatoyota.com/denver/offers/yarisia",
//     // 3
//     "https://www.buyatoyota.com/pacificnorthwest/offers/avalon",
//     "https://www.buyatoyota.com/pacificnorthwest/offers/camry",
//     "https://www.buyatoyota.com/pacificnorthwest/offers/corolla",
//     "https://www.buyatoyota.com/pacificnorthwest/offers/corollahatchback",
//     "https://www.buyatoyota.com/pacificnorthwest/offers/sienna",
//     "https://www.buyatoyota.com/pacificnorthwest/offers/yaris",
//     "https://www.buyatoyota.com/pacificnorthwest/offers/yarisliftback",
//     "https://www.buyatoyota.com/pacificnorthwest/offers/tacoma",
//     "https://www.buyatoyota.com/pacificnorthwest/offers/tundra",
//     "https://www.buyatoyota.com/pacificnorthwest/offers/4runner",
//     "https://www.buyatoyota.com/pacificnorthwest/offers/c-hr",
//     "https://www.buyatoyota.com/pacificnorthwest/offers/highlander",
//     "https://www.buyatoyota.com/pacificnorthwest/offers/landcruiser",
//     "https://www.buyatoyota.com/pacificnorthwest/offers/rav4",
//     "https://www.buyatoyota.com/pacificnorthwest/offers/sequoia",
//     "https://www.buyatoyota.com/pacificnorthwest/offers/avalonhybrid",
//     "https://www.buyatoyota.com/pacificnorthwest/offers/camryhybrid",
//     "https://www.buyatoyota.com/pacificnorthwest/offers/highlanderhybrid",
//     "https://www.buyatoyota.com/pacificnorthwest/offers/prius",
//     "https://www.buyatoyota.com/pacificnorthwest/offers/priusprime",
//     "https://www.buyatoyota.com/pacificnorthwest/offers/priusc",
//     "https://www.buyatoyota.com/pacificnorthwest/offers/rav4hybrid",
//     "https://www.buyatoyota.com/pacificnorthwest/offers/corollaim",
//     "https://www.buyatoyota.com/pacificnorthwest/offers/yarisia",
//     //    
//     "https://www.buyatoyota.com/central/offers/avalon",
//     "https://www.buyatoyota.com/central/offers/camry",
//     "https://www.buyatoyota.com/central/offers/corolla",
//     "https://www.buyatoyota.com/central/offers/corollahatchback",
//     "https://www.buyatoyota.com/central/offers/sienna",
//     "https://www.buyatoyota.com/central/offers/yaris",
//     "https://www.buyatoyota.com/central/offers/yarisliftback",
//     "https://www.buyatoyota.com/central/offers/tacoma",
//     "https://www.buyatoyota.com/central/offers/tundra",
//     "https://www.buyatoyota.com/central/offers/4runner",
//     "https://www.buyatoyota.com/central/offers/c-hr",
//     "https://www.buyatoyota.com/central/offers/highlander",
//     "https://www.buyatoyota.com/central/offers/landcruiser",
//     "https://www.buyatoyota.com/central/offers/rav4",
//     "https://www.buyatoyota.com/central/offers/sequoia",
//     "https://www.buyatoyota.com/central/offers/avalonhybrid",
//     "https://www.buyatoyota.com/central/offers/camryhybrid",
//     "https://www.buyatoyota.com/central/offers/highlanderhybrid",
//     "https://www.buyatoyota.com/central/offers/prius",
//     "https://www.buyatoyota.com/central/offers/priusprime",
//     "https://www.buyatoyota.com/central/offers/priusc",
//     "https://www.buyatoyota.com/central/offers/rav4hybrid",
//     "https://www.buyatoyota.com/central/offers/corollaim",
//     "https://www.buyatoyota.com/central/offers/yarisia",
//     //
//     "https://www.buyatoyota.com/midwest/offers/avalon",
//     "https://www.buyatoyota.com/midwest/offers/camry",
//     "https://www.buyatoyota.com/midwest/offers/corolla",
//     "https://www.buyatoyota.com/midwest/offers/corollahatchback",
//     "https://www.buyatoyota.com/midwest/offers/sienna",
//     "https://www.buyatoyota.com/midwest/offers/yaris",
//     "https://www.buyatoyota.com/midwest/offers/yarisliftback",
//     "https://www.buyatoyota.com/midwest/offers/tacoma",
//     "https://www.buyatoyota.com/midwest/offers/tundra",
//     "https://www.buyatoyota.com/midwest/offers/4runner",
//     "https://www.buyatoyota.com/midwest/offers/c-hr",
//     "https://www.buyatoyota.com/midwest/offers/highlander",
//     "https://www.buyatoyota.com/midwest/offers/landcruiser",
//     "https://www.buyatoyota.com/midwest/offers/rav4",
//     "https://www.buyatoyota.com/midwest/offers/sequoia",
//     "https://www.buyatoyota.com/midwest/offers/avalonhybrid",
//     "https://www.buyatoyota.com/midwest/offers/camryhybrid",
//     "https://www.buyatoyota.com/midwest/offers/highlanderhybrid",
//     "https://www.buyatoyota.com/midwest/offers/prius",
//     "https://www.buyatoyota.com/midwest/offers/priusprime",
//     "https://www.buyatoyota.com/midwest/offers/priusc",
//     "https://www.buyatoyota.com/midwest/offers/rav4hybrid",
//     "https://www.buyatoyota.com/midwest/offers/corollaim",
//     "https://www.buyatoyota.com/midwest/offers/yarisia",
//     // 6
//     "https://www.buyatoyota.com/upstateny/offers/avalon",
//     "https://www.buyatoyota.com/upstateny/offers/camry",
//     "https://www.buyatoyota.com/upstateny/offers/corolla",
//    "https://www.buyatoyota.com/upstateny/offers/corollahatchback",
//     "https://www.buyatoyota.com/upstateny/offers/sienna",
//     "https://www.buyatoyota.com/upstateny/offers/yaris",
//     "https://www.buyatoyota.com/upstateny/offers/yarisliftback",
//     "https://www.buyatoyota.com/upstateny/offers/tacoma",
//     "https://www.buyatoyota.com/upstateny/offers/tundra",
//     "https://www.buyatoyota.com/upstateny/offers/4runner",
//     "https://www.buyatoyota.com/upstateny/offers/c-hr",
//     "https://www.buyatoyota.com/upstateny/offers/highlander",
//     "https://www.buyatoyota.com/upstateny/offers/landcruiser",
//     "https://www.buyatoyota.com/upstateny/offers/rav4",
//     "https://www.buyatoyota.com/upstateny/offers/sequoia",
//     "https://www.buyatoyota.com/upstateny/offers/avalonhybrid",
//     "https://www.buyatoyota.com/upstateny/offers/camryhybrid",
//     "https://www.buyatoyota.com/upstateny/offers/highlanderhybrid",
//     "https://www.buyatoyota.com/upstateny/offers/prius",
//     "https://www.buyatoyota.com/upstateny/offers/priusprime",
//     "https://www.buyatoyota.com/upstateny/offers/priusc",
//     "https://www.buyatoyota.com/upstateny/offers/rav4hybrid",
//     "https://www.buyatoyota.com/upstateny/offers/corollaim",
//     "https://www.buyatoyota.com/upstateny/offers/yarisia",
//     // 7
//     "https://www.buyatoyota.com/connecticut/offers/avalon",
//     "https://www.buyatoyota.com/connecticut/offers/camry",
//     "https://www.buyatoyota.com/connecticut/offers/corolla",
//    "https://www.buyatoyota.com/connecticut/offers/corollahatchback",
//     "https://www.buyatoyota.com/connecticut/offers/sienna",
//     "https://www.buyatoyota.com/connecticut/offers/yaris",
//     "https://www.buyatoyota.com/connecticut/offers/yarisliftback",
//     "https://www.buyatoyota.com/connecticut/offers/tacoma",
//     "https://www.buyatoyota.com/connecticut/offers/tundra",
//     "https://www.buyatoyota.com/connecticut/offers/4runner",
//     "https://www.buyatoyota.com/connecticut/offers/c-hr",
//     "https://www.buyatoyota.com/connecticut/offers/highlander",
//     "https://www.buyatoyota.com/connecticut/offers/landcruiser",
//     "https://www.buyatoyota.com/connecticut/offers/rav4",
//     "https://www.buyatoyota.com/connecticut/offers/sequoia",
//     "https://www.buyatoyota.com/connecticut/offers/avalonhybrid",
//     "https://www.buyatoyota.com/connecticut/offers/camryhybrid",
//     "https://www.buyatoyota.com/connecticut/offers/highlanderhybrid",
//     "https://www.buyatoyota.com/connecticut/offers/prius",
//     "https://www.buyatoyota.com/connecticut/offers/priusprime",
//     "https://www.buyatoyota.com/connecticut/offers/priusc",
//     "https://www.buyatoyota.com/connecticut/offers/rav4hybrid",
//     "https://www.buyatoyota.com/connecticut/offers/corollaim",
//     "https://www.buyatoyota.com/connecticut/offers/yarisia",
//     // 8
//     "https://www.buyatoyota.com/tristateeast/offers/avalon",
//     "https://www.buyatoyota.com/tristateeast/offers/camry",
//     "https://www.buyatoyota.com/tristateeast/offers/corolla",
//     "https://www.buyatoyota.com/tristateeast/offers/corollahatchback",
//     "https://www.buyatoyota.com/tristateeast/offers/sienna",
//     "https://www.buyatoyota.com/tristateeast/offers/yaris",
//     "https://www.buyatoyota.com/tristateeast/offers/yarisliftback",
//     "https://www.buyatoyota.com/tristateeast/offers/tacoma",
//     "https://www.buyatoyota.com/tristateeast/offers/tundra",
//     "https://www.buyatoyota.com/tristateeast/offers/4runner",
//     "https://www.buyatoyota.com/tristateeast/offers/c-hr",
//     "https://www.buyatoyota.com/tristateeast/offers/highlander",
//     "https://www.buyatoyota.com/tristateeast/offers/landcruiser",
//     "https://www.buyatoyota.com/tristateeast/offers/rav4",
//     "https://www.buyatoyota.com/tristateeast/offers/sequoia",
//     "https://www.buyatoyota.com/tristateeast/offers/avalonhybrid",
//     "https://www.buyatoyota.com/tristateeast/offers/camryhybrid",
//     "https://www.buyatoyota.com/tristateeast/offers/highlanderhybrid",
//     "https://www.buyatoyota.com/tristateeast/offers/prius",
//     "https://www.buyatoyota.com/tristateeast/offers/priusprime",
//     "https://www.buyatoyota.com/tristateeast/offers/priusc",
//     "https://www.buyatoyota.com/tristateeast/offers/rav4hybrid",
//     "https://www.buyatoyota.com/tristateeast/offers/corollaim",
//     "https://www.buyatoyota.com/tristateeast/offers/yarisia",
//     // 9
//     "https://www.buyatoyota.com/tristate/offers/avalon",
//     "https://www.buyatoyota.com/tristate/offers/camry",
//     "https://www.buyatoyota.com/tristate/offers/corolla",
//    "https://www.buyatoyota.com/tristate/offers/corollahatchback",
//     "https://www.buyatoyota.com/tristate/offers/sienna",
//     "https://www.buyatoyota.com/tristate/offers/yaris",
//     "https://www.buyatoyota.com/tristate/offers/yarisliftback",
//     "https://www.buyatoyota.com/tristate/offers/tacoma",
//     "https://www.buyatoyota.com/tristate/offers/tundra",
//     "https://www.buyatoyota.com/tristate/offers/4runner",
//     "https://www.buyatoyota.com/tristate/offers/c-hr",
//     "https://www.buyatoyota.com/tristate/offers/highlander",
//     "https://www.buyatoyota.com/tristate/offers/landcruiser",
//     "https://www.buyatoyota.com/tristate/offers/rav4",
//     "https://www.buyatoyota.com/tristate/offers/sequoia",
//     "https://www.buyatoyota.com/tristate/offers/avalonhybrid",
//     "https://www.buyatoyota.com/tristate/offers/camryhybrid",
//     "https://www.buyatoyota.com/tristate/offers/highlanderhybrid",
//     "https://www.buyatoyota.com/tristate/offers/prius",
//     "https://www.buyatoyota.com/tristate/offers/priusprime",
//     "https://www.buyatoyota.com/tristate/offers/priusc",
//     "https://www.buyatoyota.com/tristate/offers/rav4hybrid",
//     "https://www.buyatoyota.com/tristate/offers/corollaim",
//     "https://www.buyatoyota.com/tristate/offers/yarisia",
// // ------------------------------------------------------------------------------
//     // 1
//     "https://www.buyatoyota.com/es/greaterny/offers/86",
//     "https://www.buyatoyota.com/es/greaterny/offers/avalon",
//     "https://www.buyatoyota.com/es/greaterny/offers/camry",
//     "https://www.buyatoyota.com/es/greaterny/offers/corolla",
//     "https://www.buyatoyota.com/es/greaterny/offers/corollahatchback",
//     "https://www.buyatoyota.com/es/greaterny/offers/sienna",
//     "https://www.buyatoyota.com/es/greaterny/offers/yaris",
//     "https://www.buyatoyota.com/es/greaterny/offers/yarisliftback",
//     "https://www.buyatoyota.com/es/greaterny/offers/tacoma",
//     "https://www.buyatoyota.com/es/greaterny/offers/tundra",
//     "https://www.buyatoyota.com/es/greaterny/offers/4runner",
//     "https://www.buyatoyota.com/es/greaterny/offers/c-hr",
//     "https://www.buyatoyota.com/es/greaterny/offers/highlander",
//     "https://www.buyatoyota.com/es/greaterny/offers/landcruiser",
//     "https://www.buyatoyota.com/es/greaterny/offers/rav4",
//     "https://www.buyatoyota.com/es/greaterny/offers/sequoia",
//     "https://www.buyatoyota.com/es/greaterny/offers/avalonhybrid",
//     "https://www.buyatoyota.com/es/greaterny/offers/camryhybrid",
//     "https://www.buyatoyota.com/es/greaterny/offers/highlanderhybrid",
//     "https://www.buyatoyota.com/es/greaterny/offers/prius",
//     "https://www.buyatoyota.com/es/greaterny/offers/priusprime",
//     "https://www.buyatoyota.com/es/greaterny/offers/priusc",
//     "https://www.buyatoyota.com/es/greaterny/offers/rav4hybrid",
//     "https://www.buyatoyota.com/es/greaterny/offers/corollaim",
//     "https://www.buyatoyota.com/es/greaterny/offers/yarisia",
//     // 2
//     "https://www.buyatoyota.com/es/denver/offers/86",
//     "https://www.buyatoyota.com/es/denver/offers/avalon",
//     "https://www.buyatoyota.com/es/denver/offers/camry",
//     "https://www.buyatoyota.com/es/denver/offers/corolla",
//     "https://www.buyatoyota.com/es/denver/offers/corollahatchback",
//     "https://www.buyatoyota.com/es/denver/offers/sienna",
//     "https://www.buyatoyota.com/es/denver/offers/yaris",
//     "https://www.buyatoyota.com/es/denver/offers/yarisliftback",
//     "https://www.buyatoyota.com/es/denver/offers/tacoma",
//     "https://www.buyatoyota.com/es/denver/offers/tundra",
//     "https://www.buyatoyota.com/es/denver/offers/4runner",
//     "https://www.buyatoyota.com/es/denver/offers/c-hr",
//     "https://www.buyatoyota.com/es/denver/offers/highlander",
//     "https://www.buyatoyota.com/es/denver/offers/landcruiser",
//     "https://www.buyatoyota.com/es/denver/offers/rav4",
//     "https://www.buyatoyota.com/es/denver/offers/sequoia",
//     "https://www.buyatoyota.com/es/denver/offers/avalonhybrid",
//     "https://www.buyatoyota.com/es/denver/offers/camryhybrid",
//     "https://www.buyatoyota.com/es/denver/offers/highlanderhybrid",
//     "https://www.buyatoyota.com/es/denver/offers/prius",
//     "https://www.buyatoyota.com/es/denver/offers/priusprime",
//     "https://www.buyatoyota.com/es/denver/offers/priusc",
//     "https://www.buyatoyota.com/es/denver/offers/rav4hybrid",
//     "https://www.buyatoyota.com/es/denver/offers/corollaim",
//     "https://www.buyatoyota.com/es/denver/offers/yarisia",
//     // 3
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/avalon",
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/camry",
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/corolla",
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/corollahatchback",
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/sienna",
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/yaris",
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/yarisliftback",
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/tacoma",
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/tundra",
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/4runner",
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/c-hr",
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/highlander",
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/landcruiser",
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/rav4",
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/sequoia",
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/avalonhybrid",
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/camryhybrid",
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/highlanderhybrid",
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/prius",
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/priusprime",
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/priusc",
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/rav4hybrid",
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/corollaim",
//     "https://www.buyatoyota.com/es/pacificnorthwest/offers/yarisia",
//     //    
//     "https://www.buyatoyota.com/es/central/offers/avalon",
//     "https://www.buyatoyota.com/es/central/offers/camry",
//     "https://www.buyatoyota.com/es/central/offers/corolla",
//     "https://www.buyatoyota.com/es/central/offers/corollahatchback",
//     "https://www.buyatoyota.com/es/central/offers/sienna",
//     "https://www.buyatoyota.com/es/central/offers/yaris",
//     "https://www.buyatoyota.com/es/central/offers/yarisliftback",
//     "https://www.buyatoyota.com/es/central/offers/tacoma",
//     "https://www.buyatoyota.com/es/central/offers/tundra",
//     "https://www.buyatoyota.com/es/central/offers/4runner",
//     "https://www.buyatoyota.com/es/central/offers/c-hr",
//     "https://www.buyatoyota.com/es/central/offers/highlander",
//     "https://www.buyatoyota.com/es/central/offers/landcruiser",
//     "https://www.buyatoyota.com/es/central/offers/rav4",
//     "https://www.buyatoyota.com/es/central/offers/sequoia",
//     "https://www.buyatoyota.com/es/central/offers/avalonhybrid",
//     "https://www.buyatoyota.com/es/central/offers/camryhybrid",
//     "https://www.buyatoyota.com/es/central/offers/highlanderhybrid",
//     "https://www.buyatoyota.com/es/central/offers/prius",
//     "https://www.buyatoyota.com/es/central/offers/priusprime",
//     "https://www.buyatoyota.com/es/central/offers/priusc",
//     "https://www.buyatoyota.com/es/central/offers/rav4hybrid",
//     "https://www.buyatoyota.com/es/central/offers/corollaim",
//     "https://www.buyatoyota.com/es/central/offers/yarisia",
//     //
//     "https://www.buyatoyota.com/es/midwest/offers/avalon",
//     "https://www.buyatoyota.com/es/midwest/offers/camry",
//     "https://www.buyatoyota.com/es/midwest/offers/corolla",
//     "https://www.buyatoyota.com/es/midwest/offers/corollahatchback",
//     "https://www.buyatoyota.com/es/midwest/offers/sienna",
//     "https://www.buyatoyota.com/es/midwest/offers/yaris",
//     "https://www.buyatoyota.com/es/midwest/offers/yarisliftback",
//     "https://www.buyatoyota.com/es/midwest/offers/tacoma",
//     "https://www.buyatoyota.com/es/midwest/offers/tundra",
//     "https://www.buyatoyota.com/es/midwest/offers/4runner",
//     "https://www.buyatoyota.com/es/midwest/offers/c-hr",
//     "https://www.buyatoyota.com/es/midwest/offers/highlander",
//     "https://www.buyatoyota.com/es/midwest/offers/landcruiser",
//     "https://www.buyatoyota.com/es/midwest/offers/rav4",
//     "https://www.buyatoyota.com/es/midwest/offers/sequoia",
//     "https://www.buyatoyota.com/es/midwest/offers/avalonhybrid",
//     "https://www.buyatoyota.com/es/midwest/offers/camryhybrid",
//     "https://www.buyatoyota.com/es/midwest/offers/highlanderhybrid",
//     "https://www.buyatoyota.com/es/midwest/offers/prius",
//     "https://www.buyatoyota.com/es/midwest/offers/priusprime",
//     "https://www.buyatoyota.com/es/midwest/offers/priusc",
//     "https://www.buyatoyota.com/es/midwest/offers/rav4hybrid",
//     "https://www.buyatoyota.com/es/midwest/offers/corollaim",
//     "https://www.buyatoyota.com/es/midwest/offers/yarisia",
//     // 6
//     "https://www.buyatoyota.com/es/upstateny/offers/avalon",
//     "https://www.buyatoyota.com/es/upstateny/offers/camry",
//     "https://www.buyatoyota.com/es/upstateny/offers/corolla",
//    "https://www.buyatoyota.com/es/upstateny/offers/corollahatchback",
//     "https://www.buyatoyota.com/es/upstateny/offers/sienna",
//     "https://www.buyatoyota.com/es/upstateny/offers/yaris",
//     "https://www.buyatoyota.com/es/upstateny/offers/yarisliftback",
//     "https://www.buyatoyota.com/es/upstateny/offers/tacoma",
//     "https://www.buyatoyota.com/es/upstateny/offers/tundra",
//     "https://www.buyatoyota.com/es/upstateny/offers/4runner",
//     "https://www.buyatoyota.com/es/upstateny/offers/c-hr",
//     "https://www.buyatoyota.com/es/upstateny/offers/highlander",
//     "https://www.buyatoyota.com/es/upstateny/offers/landcruiser",
//     "https://www.buyatoyota.com/es/upstateny/offers/rav4",
//     "https://www.buyatoyota.com/es/upstateny/offers/sequoia",
//     "https://www.buyatoyota.com/es/upstateny/offers/avalonhybrid",
//     "https://www.buyatoyota.com/es/upstateny/offers/camryhybrid",
//     "https://www.buyatoyota.com/es/upstateny/offers/highlanderhybrid",
//     "https://www.buyatoyota.com/es/upstateny/offers/prius",
//     "https://www.buyatoyota.com/es/upstateny/offers/priusprime",
//     "https://www.buyatoyota.com/es/upstateny/offers/priusc",
//     "https://www.buyatoyota.com/es/upstateny/offers/rav4hybrid",
//     "https://www.buyatoyota.com/es/upstateny/offers/corollaim",
//     "https://www.buyatoyota.com/es/upstateny/offers/yarisia",
//     // 7
//     "https://www.buyatoyota.com/es/connecticut/offers/avalon",
//     "https://www.buyatoyota.com/es/connecticut/offers/camry",
//     "https://www.buyatoyota.com/es/connecticut/offers/corolla",
//    "https://www.buyatoyota.com/es/connecticut/offers/corollahatchback",
//     "https://www.buyatoyota.com/es/connecticut/offers/sienna",
//     "https://www.buyatoyota.com/es/connecticut/offers/yaris",
//     "https://www.buyatoyota.com/es/connecticut/offers/yarisliftback",
//     "https://www.buyatoyota.com/es/connecticut/offers/tacoma",
//     "https://www.buyatoyota.com/es/connecticut/offers/tundra",
//     "https://www.buyatoyota.com/es/connecticut/offers/4runner",
//     "https://www.buyatoyota.com/es/connecticut/offers/c-hr",
//     "https://www.buyatoyota.com/es/connecticut/offers/highlander",
//     "https://www.buyatoyota.com/es/connecticut/offers/landcruiser",
//     "https://www.buyatoyota.com/es/connecticut/offers/rav4",
//     "https://www.buyatoyota.com/es/connecticut/offers/sequoia",
//     "https://www.buyatoyota.com/es/connecticut/offers/avalonhybrid",
//     "https://www.buyatoyota.com/es/connecticut/offers/camryhybrid",
//     "https://www.buyatoyota.com/es/connecticut/offers/highlanderhybrid",
//     "https://www.buyatoyota.com/es/connecticut/offers/prius",
//     "https://www.buyatoyota.com/es/connecticut/offers/priusprime",
//     "https://www.buyatoyota.com/es/connecticut/offers/priusc",
//     "https://www.buyatoyota.com/es/connecticut/offers/rav4hybrid",
//     "https://www.buyatoyota.com/es/connecticut/offers/corollaim",
//     "https://www.buyatoyota.com/es/connecticut/offers/yarisia",
//     // 8
//     "https://www.buyatoyota.com/es/tristateeast/offers/avalon",
//     "https://www.buyatoyota.com/es/tristateeast/offers/camry",
//     "https://www.buyatoyota.com/es/tristateeast/offers/corolla",
//     "https://www.buyatoyota.com/es/tristateeast/offers/corollahatchback",
//     "https://www.buyatoyota.com/es/tristateeast/offers/sienna",
//     "https://www.buyatoyota.com/es/tristateeast/offers/yaris",
//     "https://www.buyatoyota.com/es/tristateeast/offers/yarisliftback",
//     "https://www.buyatoyota.com/es/tristateeast/offers/tacoma",
//     "https://www.buyatoyota.com/es/tristateeast/offers/tundra",
//     "https://www.buyatoyota.com/es/tristateeast/offers/4runner",
//     "https://www.buyatoyota.com/es/tristateeast/offers/c-hr",
//     "https://www.buyatoyota.com/es/tristateeast/offers/highlander",
//     "https://www.buyatoyota.com/es/tristateeast/offers/landcruiser",
//     "https://www.buyatoyota.com/es/tristateeast/offers/rav4",
//     "https://www.buyatoyota.com/es/tristateeast/offers/sequoia",
//     "https://www.buyatoyota.com/es/tristateeast/offers/avalonhybrid",
//     "https://www.buyatoyota.com/es/tristateeast/offers/camryhybrid",
//     "https://www.buyatoyota.com/es/tristateeast/offers/highlanderhybrid",
//     "https://www.buyatoyota.com/es/tristateeast/offers/prius",
//     "https://www.buyatoyota.com/es/tristateeast/offers/priusprime",
//     "https://www.buyatoyota.com/es/tristateeast/offers/priusc",
//     "https://www.buyatoyota.com/es/tristateeast/offers/rav4hybrid",
//     "https://www.buyatoyota.com/es/tristateeast/offers/corollaim",
//     "https://www.buyatoyota.com/es/tristateeast/offers/yarisia",
//     // 9
//     "https://www.buyatoyota.com/es/tristate/offers/avalon",
//     "https://www.buyatoyota.com/es/tristate/offers/camry",
//     "https://www.buyatoyota.com/es/tristate/offers/corolla",
//    "https://www.buyatoyota.com/es/tristate/offers/corollahatchback",
//     "https://www.buyatoyota.com/es/tristate/offers/sienna",
//     "https://www.buyatoyota.com/es/tristate/offers/yaris",
//     "https://www.buyatoyota.com/es/tristate/offers/yarisliftback",
//     "https://www.buyatoyota.com/es/tristate/offers/tacoma",
//     "https://www.buyatoyota.com/es/tristate/offers/tundra",
//     "https://www.buyatoyota.com/es/tristate/offers/4runner",
//     "https://www.buyatoyota.com/es/tristate/offers/c-hr",
//     "https://www.buyatoyota.com/es/tristate/offers/highlander",
//     "https://www.buyatoyota.com/es/tristate/offers/landcruiser",
//     "https://www.buyatoyota.com/es/tristate/offers/rav4",
//     "https://www.buyatoyota.com/es/tristate/offers/sequoia",
//     "https://www.buyatoyota.com/es/tristate/offers/avalonhybrid",
//     "https://www.buyatoyota.com/es/tristate/offers/camryhybrid",
//     "https://www.buyatoyota.com/es/tristate/offers/highlanderhybrid",
//     "https://www.buyatoyota.com/es/tristate/offers/prius",
//     "https://www.buyatoyota.com/es/tristate/offers/priusprime",
//     "https://www.buyatoyota.com/es/tristate/offers/priusc",
//     "https://www.buyatoyota.com/es/tristate/offers/rav4hybrid",
//     "https://www.buyatoyota.com/es/tristate/offers/corollaim",
//     "https://www.buyatoyota.com/es/tristate/offers/yarisia",
// //
// ]


// launchPuppeteer(sharedUrlArray, "https://www.buyatoyota.com", "greaterny/");
    getUrlObj('greaterny', false);

    // 'pacificnorthwest', 'central', 'midwest',
    // 'greaterny', 'upstateny', 'connecticut', 
    // 'tristateeast', 'tristate', 'denver'










// async function URLCapture(urlsArray) {
//     for(i=0; i < urlsArray.length; i++) {
//         const page = await browser.newPage();
//         await page.goto(urlsArray[i]);
//         await page.screenshot({
//             path: (urlsArray[i].substring(27, urlsArray[i].length).replace('/', '_')),
//             // inherently decides adds file
//             // type: ''
//         });
//     }
// }

// old, working version for one URL: used weird parethases syntax:
// (async (a) => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     const URLForPicture = 'https://www.buyatoyota.com/greaterny';
//     await page.goto(URLForPicture);
//     await page.screenshot({path: URLForPicture.substring(27, URLForPicture.length).replace('/', '_') + '.png'});

//     console.log(a);
//     // return new Promise((resolve, reject) => {
//     // })
//     // .then ({})
//     // .catch({
//     //     await browser.close;
//     // })
//     // URLCapture(['https://www.buyatoyota.com/greaterny']);
//     await browser.close();
//     console.log('it looks like it fired...?');
// })(); 

// -------------------------------------------------------------------------------------------------------------------------------


// puppeteer.launch().then(async browser => {
//     const page = await browser.newPage();
//     await page.goto('https://google.com');
//     await page.screenshot({path: 'example.png'});

//     await browser.close();
// })


// ----------------------------------------------------------------------- old async, if you ever need it: ----------------------------------------------------------------------- 


// async function grabUrlsFromSiteMap(regionURL) {
//     let browser = await puppeteer.launch({
//         // headless: false // included in the event we want to watch the action!
//     });
//     let page = await browser.newPage();
//     let url = 'http://www.buyatoyota.com/' + regionURL +"/sitemap"; 
//     await page.goto(url, {waitUntil: "domcontentloaded"}); // await page.goto(url, {waitUntil: "Window.load"}); -- maybe switch to something like this later

//     // -----------------------------------------------
//     page.on('console', msg => {
//         for (let i = 0; i < msg.args.length; ++i)
//             console.log(`${i}: ${msg.args[i]}`);
//     });
//     // ^^ I have no recollection of what this does - maybe supposed to help with the console.log problem from before?  ^^
//     // let finalUrl
//     let arrayFromUrlObject = (obj, str, arr) => {
//         let myAccumulator = arr;
//         for (key in obj) {
//             let currentUrl = Object.getOwnPropertyNames(obj), 
//                 nextString = str + "/" + key;
//             myAccumulator.push(nextString);
//             // if (!obj.hasOwnProperty(key)) {
//             //     continue;
//             // };
//             // if(typeof obj[key] == 'object') {
//                 arrayFromUrlObject(obj[key], nextString, myAccumulator);
//             // }

//     // ^^ two checks we may be able to do away with later

//         }
//         return myAccumulator;
//     }

//     // -----------------------------------------------
//     let listOfUrls = await page.evaluate(() => {

//         let data = [];
//         let data2 = {};

//         let checkArrayAgainstObject = (incomingObject, incomingArray) => {
//             let currentKeys = [], currentObject = incomingObject;
//             for(let i=0; i<incomingArray.length; i++) {
//               currentKeys = (Object.keys(currentObject));
//               if(!currentKeys.includes(incomingArray[i])) {
//                 currentObject[incomingArray[i]] = {};
//               }
//               currentObject = currentObject[incomingArray[i]];
//             }
//             console.log(incomingObject);
//             return incomingObject;
//         }
//         // let elements = document.getElementsByClassName('datalayer-link'); // just grab all urls I think
//         let elements = document.getElementsByTagName('a');
//         // for (var element of elements) {
//         for(let i = 0; i < elements.length; i++) {
            
//         //     if(element.href && element.href.substring(0, 26) == 'https://www.buyatoyota.com') { //this may not be accurate because some hrefs are not complete? (eg href="/greaterny/dealerships")
        
//         //         let thisUrl = element.href; //instead of mutating original element / for legibility
//         //         if(thisUrl[thisUrl.length - 1] == '/') { // eliminates end slash - seemed to f puppeteer up!
//         //             thisUrl = thisUrl.substring(0, thisUrl.length - 1);
//         //         }
//         //         (!data.includes(thisUrl)) ? data.push(thisUrl) : {} // removes redundancies
//         //     }
//             if(elements[i].href) {
//                 let slashDelineated = elements[i].href.split('/').filter(word => word != '');

//                 // let currentObject = {};
//                 // for(let i=0; i < slashDelineated.length; i++) {
//                 //     currentObject[slashDelineated[i]] = {};
//                 //     // if(currentObject){} // will do later!
//                 // }

//                 const reducer = (acc, item) => ({ // orig!
//                         [item]: acc
//                 });
//                 // let objectifiedUrl = slashDelineated.reduceRight(reducer, {});
//                 // ^^ makes object
//                 // data.push(slashDelineated.reduceRight(reducer, {}));
//                 checkArrayAgainstObject(data2, slashDelineated);


//                 // ^^ this works-ish, puts a copy of the entire string object in - redundant
//                 // need to check if the data object contains that object!
//             }
//         }
//         // console.log(data);
//         // return data;

//         // console.log(data2);
//         return data2;
//     });
//     // console.log(listOfUrls);
//     // console.log(util.inspect(listOfUrls, {showHidden: false, depth: null}));
//     await browser.close();
//     let ultimateUrlArray = arrayFromUrlObject(listOfUrls, "", []);
//     console.log(util.inspect(ultimateUrlArray, {showHidden: false, depth: null}));
//     // launchPuppeteer(listOfUrls);
//     // ^^ sends these links to puppeteer ^^ 
// }


