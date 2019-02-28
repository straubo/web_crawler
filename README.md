Hello gang! If you have found yourself on this page, you are most likely a DPM for Saatchi that is doing content changes; for QA purposes, you want to check how they look en masse.

Here's what the program does/can do:

1: Goes to sitemap of a given TDA and gets a list of URLs, which the program will use later to take pictures

2: Travels to each URL in that list

3: Takes a picture of that site in the selected format (desktop or mobile), and saves it to a folder named after the TDA.

4: There is a UI that displays these photos, so you can scan through them much quicker than if you had to navigate to each URL yourself.

Things this project used to do:

save each url list to a MongoDB database
grab that list individually for each TDA and get a more complete crawl, so to speak
These features are still in the source code, but they're commented out, so they don't work right now. Kapeesh?

For the layperson, here are the technologies you need to run it, and the steps you need to take to do so:

1: You need to have Node and npm installed on your computer (I used node v. 10.14.1)

2: Ideally, you have a very simple code editor on your computer - you don't need admin permissions to install Visual Studio Code. This will make some of the steps involved easier.

3: git. This is a version control technology, and it's how you're going to get this application onto your computer.

Okay, first step: 1: git pull this repo (basically, download the project). Once you've done this, put it in a folder that you can easily find again.

2: in Powershell or another command line tool, navigate to this folder. once you're in the folder with "package.json" in it, type "npm install" and hit enter. This is the main "parent" project folder. This command installs a bunch of other stuff that you're not going to worry about right now.

Great! You've got the basic program on your computer! Once you take a celebratory break, let's run it!

Getting back to the technical stuff: there's the server part (that does the url-grabbing and the crawling and the pictures), and there's the UI part. In order for the UI part to look remotely right, you need to have already grabbed the photos!

Time to run the server that takes the pictures.

Go to that darned Powershell again. Make sure you're in the parent folder and type:

node puppeteer_server.js "greaterny" false

In the above line, substitute "greaterny" for whichever region you want to check. The false part should answer the question: do you want to check mobile? If the answer is yes, write true instead.

If you have to check all of these with the project the way it is, it's a bit tedious, I'll admit, but it allows for you to save time if you only want to check one TDA.

To be clear, the region should be in quotes (like "greaterny") and the true or false part should not. Otherwise, it won't work.

Save the file. Go back to your command line and type this: node puppeteer_server.js

At that point, it should...just start doing stuff. Check the folders for the pictures - to find these, go (from your parent directory)into src -> assets. There should be a folder for each region.

For the record: here is a list of the region names as of this moment: 'pacificnorthwest', 'central', 'midwest', 'greaterny', 'upstateny', 'connecticut', 'tristateeast', 'tristate', 'denver'

Okay! That was tough, but hopefully you got some lunch and the crawling happened without you having to click through each url. To see what just got crawled, let's fire up the UI.

In the parent folder, type:

ng serve

and hit enter.

Open up Chrome, and type

localhost:4200

The UI should be there! There's a dropdown menu for region, and on the left, there's desktop, and on the right, there's mobile.

That's all this program can do right now. I hope this helps you!

-Casey

-------------------------------------here's some technical pre-generated other stuff:-------------------------------------


# WebCrawler

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
