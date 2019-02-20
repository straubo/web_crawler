class Sitemap {
    constructor(sitemap) {
        this.exists = function(path) { // bool - makes sense
            console.log(Sitemap.makePath(path));
             //   let located = Function(`typeof this.Pages${Sitemap.makePath(path)} !== 'undefined'`);
            try {
                let evl_located = eval(`typeof this.Pages${Sitemap.makePath(path)} !== 'undefined'`); //bool - basically, is the path defined?
                console.log(evl_located);
            //   console.log(located);
                return evl_located; // rtn true
            } catch(e) {return false;} // if not, return false
        };
        try {
            this.host = window.location.origin;
            this.Pages = {};
            this.getPageLinks();
        } catch (e) {
            console.log(`Cannot create new Sitemap.`);
        }
    }

    addPage(path) {
        if(!this.exists(path)) {
            try {
                eval(`this.Pages${Sitemap.makePath(path)} = {}`);
                return true;
            } catch(e) {
                if(path.length > 1) {
                    let _tp = path;
                    _tp.pop();
                    this.addPage(_tp) ? this.addPage(path): "";
                    return false;
                }
                return false;
            }
        }
    }

    getPageLinks() {
        this.rootHost = window.location.host;
        let links = [];
        let uniqueLinks = [];
        document.querySelectorAll(`a:not([href*="#"])`).forEach((e) => {
            try{
                let href = e.href;
                if(uniqueLinks.indexOf(href) < 0) {
                    if(href.indexOf('?') > -1 ) {
                        if(!href.indexOf('/?') > -1 ) {
                            href = href.replace('?', '/?');
                        }
                    }
                    let path = href.split(this.rootHost)[1].split('/').filter(a => a);
                    links.push(path);
                    uniqueLinks.push(href);
                    this.addPage(path);
                }
            } catch(er) {
                console.log(er);
                console.log("Probably not BAT link");
            }
        });
        console.log(links);
    }
    static makePath (p) {return `['${p.join("']['")}']`};
}



const batSitemap = new Sitemap();
