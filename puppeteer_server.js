const puppeteer = require('puppeteer');
const util = require('util');
const fs = require('fs');
const mongoConnect = require('./mongoconnect');


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

    let connectCallback = (x, mongoConnection, currentRegion) => { // separated - grabs urls from mongo
        let urlsArray = arrayFromUrlObject(x, "", []);
        mongoConnection.close();
        console.log('closed the db relationship');
        // launchPuppeteer(urlsArray, "https://www.buyatoyota.com", "denver", mobile);
        launchPuppeteer(urlsArray, "https://www.buyatoyota.com", currentRegion, mobile); // will it be able to read mobile?
    }

    let UrlObj = mongoConnect.retrieveUrlObj(region, connectCallback); // grabs url from Mongo
    console.log(UrlObj);
    
    // in the event you wanna re-pull json:
    // let otherUrlObj = fs.readFile('combined_array.json', 'utf8', function read(err, data) { // used to be generic, but....
    //      if (err) {
    //          throw err;
    //      }
    //      console.log(data);
    //      let content = JSON.parse(data);
    //     //let arrayifiedUrlObj = arrayFromUrlObject(content, "", []);
    //     // return content;
    //     // return arrayifiedUrlObj;
    //     //launchPuppeteer(arrayifiedUrlObj, "https://www.buyatoyota.com/greaterny/");
    //     //launchPuppeteer(content.urls, "https://www.buyatoyota.com", "denver");
    //     launchPuppeteer(content.urls, "https://www.buyatoyota.com", region);
    //                                              // ^^ we can genericize this later ^^
    // })
}


async function launchPuppeteer(urls, mainUrl, region, mobileYes) {
    let browser = await puppeteer.launch(
        // {headless: false}  // included in the event we want to watch the action!
        );
    let page = await browser.newPage();


// ---------------------------------------------------    mobile    ---------------------------------------------------

    if (mobileYes) {
        await page.setViewport({
            width: 375,
            height: 812,
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

            // mobile:
            if(currentUrl[0] == '_') {currentUrl = currentUrl.substring(1)}; // cleaning up filepath string
            if(currentUrl[-1] == "_") {currentUrl = currentUrl.substring(0, currentUrl.length - 1)}; // cleaning up filepath string

            if (mobileYes) {
                currentUrl = "mobile_" + currentUrl.replace(/\//gi, '_').replace(/\-/gi, '_').replace(/\./gi, '_') + '.png'; 
            } else {
            // currentUrl = "mobile_" + currentUrl.replace(/\//gi, '_').replace(/\-/gi, '_').replace(/\./gi, '_') + '.png'; 
            // desktop:
                currentUrl = currentUrl.replace(/\//gi, '_').replace(/\-/gi, '_').replace(/\./gi, '_') + '.png';
            }
            await page.screenshot({
                // path: "./test_now/" + currentUrl,
                // path: "./src/assets/test_now/" + currentUrl,

                path: "./src/assets/" + region + '/' + currentUrl,
                fullPage: true,
            })
            console.log("number " + i + " is done.");
        } catch(err) {
            console.log(err);
        }
    }
    await browser.close();
}

getUrlObj('greaterny', false);



// gets obj from Mongo:
// getUrlObj();

// ---------------------------------------- url looper ----------------------------------------------------

// urlGrabber.grabUrlsFromSiteMap("greaterny");


// launchPuppeteer(sharedUrlArray, "https://www.buyatoyota.com", "greaterny/");
    // getUrlObj('pacificnorthwest', false);

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


