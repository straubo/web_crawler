// 'pacificnorthwest', 'central', 'midwest',
// 'greaterny', 'upstateny', 'connecticut', 
// 'tristateeast', 'tristate', 'denver'

const puppeteer = require('puppeteer');
const util = require('util');
const fs = require('fs');
const currentUrls = require('./urls.json');
const mongoConnect = require('./mongoconnect');
// const data2 = require('./urls.json');

// don't forget about espanol!
// , currentUrlObj
async function grabUrlsFromSiteMap(rootURL, regionURL) {
    // let data2 = currentUrls;
    let browser = await puppeteer.launch({
        //headless: false // included in the event we want to watch the action!
    });
    let page = await browser.newPage();
    let url = rootURL + '/' + regionURL + "/sitemap";
    await page.goto(url, {waitUntil: "domcontentloaded"}); 
    //let objectOfUrls = await page.evaluate((currentUrlObj) => { // if we were taking in an existing object and checking
    let objectOfUrls = await page.evaluate(() => {
        let currentUrlObj = {}; // instantiates base obj for iteration
        let elements = document.getElementsByTagName('a'); 
        let checkArrayAgainstObject = (incomingObject, incomingArray) => {
            let currentKeys = [], currentObject = incomingObject;
            for(let i=0; i<incomingArray.length; i++) {
                currentKeys = (Object.keys(currentObject));
                if(!currentKeys.includes(incomingArray[i])) {
                    currentObject[incomingArray[i]] = {};
                }
                currentObject = currentObject[incomingArray[i]];
            }
            return incomingObject;
        }
        for(let i = 0; i < elements.length; i++) {
            // && elements[i].href != "www.buyatoyota.com" // this is a mistake probably - you have to filter out a rogue "buyatoyota.com"
            if(elements[i].href) {
                let slashDelineated = elements[i].href.split('/').filter(word => word != ''); // parses href string, creates array of slash-delineated strings
                let regex = /\./g;
                slashDelineated[slashDelineated.length - 1] = slashDelineated[slashDelineated.length - 1].replace(regex, "_-_-z-_-_");
                // let slashDelineated = elements[i].href.replace(".", "_-_-z-_-_").split('/').filter(word => word != '');

                // if(slashDelineated[0] == 'https:' || slashDelineated[0] == "www.buyatoyota.com") {continue} else { // absolutely not
                checkArrayAgainstObject(currentUrlObj, slashDelineated); // run slash-delineated arr. against the incoming object from json
                // }
            }
        }
        return { currentUrlObj };
        // return  currentUrlObj['https:']['www.buyatoyota.com'][regionURL] ;
    });
    //}, currentUrlObj); // actual incoming object

    await browser.close();

    // let data = JSON.stringify(objectOfUrls.currentUrlObj['https:']['www.buyatoyota.com'][regionURL], null, 2);
    // i believe that stringifying the object is making the object unrecievable to Mongo

    data = objectOfUrls.currentUrlObj['https:']['www.buyatoyota.com'][regionURL];
    // data = objectOfUrls;
    
    console.log(data);
    mongoConnect.upsertObj(data, regionURL);
    return data;


    // same thing, but for Denver
    //fs.writeFile('urls_denver.json', data, {flag: 'w+'}, (err) => { //need this to replace the existing content
    //    if (err) throw err;
    //    //console.log('data was written to the file');
    //});
    // -------------------------------

    // return ultimateUrlArray;
    
    // launchPuppeteer(listOfUrls);
    // ^^ sends these links to puppeteer ^^
}


module.exports = {
    grabUrlsFromSiteMap: grabUrlsFromSiteMap
}

// need one of these to go to do anything
 grabUrlsFromSiteMap("https://www.buyatoyota.com", "denver");
 // 'pacificnorthwest', 'central', 'midwest',
    //  ^problem         ^ good     ^ good
// 'greaterny', 'upstateny', 'connecticut', 
//  ^good          ^good          ^good
// 'tristateeast', 'tristate', 'denver'
//  ^good            ^good       ^good


// grabUrlsFromSiteMap('https://buyatoyota.com', 'greaterny');


//let stateOfTheUrl = grabUrlsFromSiteMap('https://www.buyatoyota.com', 'greaterny', currentUrls);

//mongoConnect.upsertObj(stateOfTheUrl);





// -------------------------------------------------------------------------------------------------------------------------------------
// recent *excursion* for the sake of json:

// let objectOfUrls = await page.evaluate((data2) => {
// console.log(data2);


    // if the file exists, data2 = its contents (have to grab synchronously, most likely)
    // if(fs.existsSync('./urls.json')) {


    // // if(fileSystem.existsSync('./urls.json')) { // seems silly... but apparently can't access fs from in here?!
    //     let contents = fs.readFileSync("urls.json");
    //     let data2 = JSON.parse(contents);                                   // need to grab the existing URL object from file, save in data2
    // } else {
    //     let data2 = {};
    // }
    // let data2 = {};
// ------------------------------------------------------------------------------------------------------------------------------------
// if ( slashDelineated[0] == 'http' || slashDelineated[0] == 'https') { // didn't work!

//     slashDelineated = slashDelineated.shift();
// }
// const reducer = (acc, item) => ({ // orig!
//         [item]: acc
// });

// ------------------------------------ that time I attempted to grab urls from json with 'await' -------------------------------------

// redo this with fetch??
// await function grabUrlObject() { // none of this is firing at all! Need to structure it like a promise I think!
//     if(fs.existsSync('urls.json')) { 
//         let contents = fs.readFileSync("urls.json");
//         console.log('hello!');
//         data2 = JSON.parse(contents); // need to grab the existing URL object from file, save in data2 
//         // return JSON.parse(contents);
//     } else {
//         data2 = {};
//         // return {};
//     }
//     hello = "fuckkkk why wont the other stuff work?!";
//     // return data2;
// }




// --------------------------------- those two checks in creating obj func I didn't want to delete! ----------------------------------
    // if (!obj.hasOwnProperty(key)) {
    //     continue;
    // };
    // if(typeof obj[key] == 'object') {

    // }
