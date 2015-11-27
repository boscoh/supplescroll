#!/usr/bin/env node
"use strict";


let doc = `
supplescroll: make interactive docs 

Usage: run.js markdown theme
`;

var mod = require('./supplescroll/build.js');

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
  mod.processFile(fname, theme, outFname);
}





