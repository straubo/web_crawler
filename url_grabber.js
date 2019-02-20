const puppeteer = require('puppeteer');
const util = require('util');
const fs = require('fs');
const currentUrls = require('./urls.json');
const mongoConnect = require('./mongoconnect');
// const data2 = require('./urls.json');
// console.log(data2);


// don't forget about espanol!
// https://www.buyatoyota.com/es/greaterny/sitemap/


// , currentUrlObj
async function grabUrlsFromSiteMap(rootURL, regionURL) {
    // let data2 = currentUrls;
    let browser = await puppeteer.launch({
        //headless: false // included in the event we want to watch the action!
    });
    let page = await browser.newPage();
    let url = rootURL + '/' + regionURL + "/sitemap";

    await page.goto(url, {waitUntil: "domcontentloaded"}); 
    //let objectOfUrls = await page.evaluate((currentUrlObj) => {
    let objectOfUrls = await page.evaluate(() => {
        let currentUrlObj = {}; // do I need this line in actuality?
        let elements = document.getElementsByTagName('a'); // grabs all links on this page
        // creates nested object from URL - checks to see if nested object is there, and if not, creates it
        // investigate if there is a problem with this: are you sure you're comparing the same level of depth with the object? Seems to work....?
        // probably just replacing entire obj instead of actually comparing... look into this later.
        // doesn't take into account the removal of endpoints! (perhaps don't need to check if obj is the same)
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
            if(elements[i].href) {
                let slashDelineated = elements[i].href.split('/').filter(word => word != ''); // parses href string, creates array of slash-delineated strings
                let regex = /\./g;
                slashDelineated[slashDelineated.length - 1] = slashDelineated[slashDelineated.length - 1].replace(regex, "_-_-z-_-_");
                // let slashDelineated = elements[i].href.replace(".", "_-_-z-_-_").split('/').filter(word => word != '');
                // right idea, but can't do this here ^^ has to be on only the 
                //for (let j = 0; j < slashDelineated.length; j++) {
                    
                //}
                console.log(currentUrlObj);
                checkArrayAgainstObject(currentUrlObj, slashDelineated); // run slash-delineated arr. against the incoming object from json
            }
        }
        return { currentUrlObj }; // maybe I should rename these so this file is more readable?
    });
    //}, currentUrlObj); // actual incoming object

    await browser.close();

    let data = JSON.stringify(objectOfUrls.currentUrlObj['https:']['www.buyatoyota.com'][regionURL], null, 2);
    // fs.writeFile('urls.json', data, {flag: 'w+'}, (err) => { //need this to replace the existing content
    console.log(data);
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
 //grabUrlsFromSiteMap("https://www.buyatoyota.com", "greaterny", currentUrls);
//  {}
grabUrlsFromSiteMap('https://buyatoyota.com', 'denver');

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
