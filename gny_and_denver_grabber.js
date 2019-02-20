const puppeteer = require('puppeteer');
const util = require('util');
const fs = require('fs');
const currentUrls = require('./urls.json');
const currentDenverUrls = require('./urls_denver.json');
let overlapObjectArray = { urls: []};
//const urlGrabber = require('./url_grabber');

//const greaterNyObj = urlGrabber.grabUrlsFromSiteMap('https://www.buyatoyota.com', 'greaterny', {});
const greaterNyObj = currentUrls;


//const denverUrlObj = urlGrabber.grabUrlsFromSiteMap('https://www.buyatoyota.com', 'denver', {});
const denverUrlObj = currentDenverUrls;


// copy-pasted from the 
let arrayFromUrlObject = (obj, str, arr) => {
  let myAccumulator = arr;
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    };
    let nextString = str + "/" + key;
    if (str == "") {
      nextString = nextString.substring(1);
    }
    let regex = /_-_-z-_-_/g;
    nextString = nextString.replace(regex, ".");

    if (typeof obj[key] == 'object' && !myAccumulator.includes(nextString)) { // must check if array already has it
      myAccumulator.push(nextString);

    }
    arrayFromUrlObject(obj[key], nextString, myAccumulator);
  }
  
  return myAccumulator;
}

let nyObjectArray = arrayFromUrlObject(greaterNyObj, "", []);
let denverObjectArray = arrayFromUrlObject(denverUrlObj, "", []);

let doAllTheThings = () => {
  for (let i = 0; i < nyObjectArray.length; i++) {
    if (denverObjectArray.includes(nyObjectArray[i])) {
      overlapObjectArray.urls.push(nyObjectArray[i]);
    }
  }
  let data = JSON.stringify(overlapObjectArray, null, 2);
  fs.writeFile('combined_array.json', data, { flag: 'w+' }, (err) => {
    if (err) throw err;
    console.log('data was written to the file');
  });
}

doAllTheThings();

//overlapObjectArray.urls = arrayFromUrlObject(denverUrlObj, "", nyObjectArray); // save to json or som'n?

//fs.writeFile('combined_array.json', data, {flag: 'w+'}, (err) => {
//  if (err) throw err;
//  console.log('data was written to the file');
//});
//console.log(util.inspect(overlapObjectArray, { showHidden: false, depth: null }));


