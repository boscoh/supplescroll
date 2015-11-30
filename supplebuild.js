#!/usr/bin/env node
"use strict";


let doc = `
Turn plain markdown/html into interactive 3-column articles

Usage: supplescroll.js markdown|html theme
    
  - themes: light, dark, yeolde, clown, sphinx

`;


if ( process.argv.length < 3 ) {

  console.log(doc);

} 
else {

    const fname = process.argv[2];
    let theme = 'dark';
    if ( process.argv.length > 3 ) {
        theme = process.argv[3];
    }
    let outFname = fname.replace('.md', '.html');
    let mod = require('./supplescroll/build.js');
    mod.processFile(fname, theme, outFname);

}





