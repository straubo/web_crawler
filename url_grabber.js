// 'pacificnorthwest', 'central', 'midwest',
// 'greaterny', 'upstateny', 'connecticut', 
// 'tristateeast', 'tristate', 'denver'

const puppeteer = require('puppeteer');
const util = require('util');
const fs = require('fs');
// const currentUrls = require('./urls.json');
const mongoConnect = require('./mongoconnect');

const urlArray = [
    'pacificnorthwest', 'central', 'midwest',
    'greaterny', 'upstateny', 'connecticut', 
    'tristateeast', 'tristate', 'denver'
]
// const data2 = require('./urls.json');

// don't forget about espanol!
// , currentUrlObj
async function grabUrlsFromSiteMap(rootURL, regionURL) {
    // let data2 = currentUrls;
    let browser = await puppeteer.launch({
        headless: false // included in the event we want to watch the action!
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
                // if(!currentKeys.includes(incomingArray[i]))
                if(!currentKeys.includes(incomingArray[i]) || currentKeys.length == 1 && currentKeys[0] == "index_-_-z-_-_page") { // ??????
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

                checkArrayAgainstObject(currentUrlObj, slashDelineated); // run slash-delineated arr. against the incoming object from json
                // }
            }
        }
        return { currentUrlObj };
    });
    //}, currentUrlObj); // actual incoming object

    await browser.close();

    // let data = JSON.stringify(objectOfUrls.currentUrlObj['https:']['www.buyatoyota.com'][regionURL], null, 2);


    // format and send the shit to mongo
    // data = objectOfUrls.currentUrlObj['https:']['www.buyatoyota.com'][regionURL];
    // mongoConnect.upsertObj(data, regionURL);

    // write to local file instead:
    data = JSON.stringify(objectOfUrls.currentUrlObj['https:']['www.buyatoyota.com'][regionURL], null, 2);
    fs.writeFile('urls_' + regionURL + '.json', data, {flag: 'w+'}, (err) => { //need this to replace the existing content
       if (err) throw err;
       console.log('data was written to the file');
    });

    // return data;
    // -------------------------------

    // return ultimateUrlArray;
}


module.exports = {
    grabUrlsFromSiteMap: grabUrlsFromSiteMap
}

// need one of these to go to do anything
// let crawlAllRegions = (a) => {
//     // for(let i=0; i<urlArray; i++) {
//     a.forEach((element) => {
//         console.log('hi');
//         grabUrlsFromSiteMap("https://www.buyatoyota.com", element);
//     })
//     // }
// }

// crawlAllRegions(urlArray);

// grabUrlsFromSiteMap("https://www.buyatoyota.com", "pacificnorthwest");
// grabUrlsFromSiteMap("https://www.buyatoyota.com", "central");
// grabUrlsFromSiteMap("https://www.buyatoyota.com", "midwest");
grabUrlsFromSiteMap("https://www.buyatoyota.com", "greaterny");
// grabUrlsFromSiteMap("https://www.buyatoyota.com", "upstateny");
// grabUrlsFromSiteMap("https://www.buyatoyota.com", "connecticut");
// grabUrlsFromSiteMap("https://www.buyatoyota.com", "tristateeast");
// grabUrlsFromSiteMap("https://www.buyatoyota.com", "tristate");
// grabUrlsFromSiteMap("https://www.buyatoyota.com", "denver");

 // 'pacificnorthwest', 'central', 'midwest',
    //  ^problem - send gny urls through
// 'greaterny', 'upstateny', 'connecticut',
// 'tristateeast', 'tristate', 'denver'


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

// --------------------------------- those two checks in creating obj func I didn't want to delete! ----------------------------------
    // if (!obj.hasOwnProperty(key)) {
    //     continue;
    // };
    // if(typeof obj[key] == 'object') {

    // }
