#!/usr/bin/env node
"use strict";


// supplebuild.js: make supplescroll from a markdown file

"use strict";

let path = require( "path" );
let fs = require( "fs-extra" );
let commonmark = require('commonmark');
let yamlFront = require('yaml-front-matter');
let mustache = require( "mustache" );
let cheerio = require( "cheerio" );
let _ = require("lodash");
let nopt = require('nopt');


let template =
`<html>
<head>
    <meta content="initial-scale=1.0" name="viewport"/>
    <title>{{ title }}</title>
    <script> window.is_rename = {{ is_rename }} </script>
</head>
<body>
    <div id="banner">{{ banner }}</div>
    {{{ content }}}
</body>
</html>`;


function convertUnicodeCharsToHtml(str) {
    let strLength = str.length;
    if (strLength === 0) {
        return '';
    }
    let result = '';
    let i = 0;
    while (i < strLength) {
        let c = str.charCodeAt(i);
        if (c <= 127) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
}


function convertCommonmarkToHtml(text) {
    let reader = new commonmark.Parser();
    let writer = new commonmark.HtmlRenderer();
    let parsed = reader.parse(text);
    return convertUnicodeCharsToHtml(writer.render(parsed));
}


function convertMarkdownToHtml( markdownText ) {
    let page = {
        'banner': '',
        'is_rename': true,
        'title': ''
    };
    _.assign( page, yamlFront.loadFront( markdownText, 'content' ) );
    page.content = convertCommonmarkToHtml( page.content );
    return mustache.render( template, page );
}


function insertIncludes( html, theme ) {
    let $ = cheerio.load( html );

    let root = $.root();

    let body = $( 'body' );
    if ( body.length == 0 ) {
        body = root
    }

    let head = $( 'head' );
    if ( head.length == 0 ) {
        head = root
    }

    if ( $( 'link[href="supplescroll.css"]').length == 0 ) {
        head.append( 
            `<link href="supplescroll.css" rel="stylesheet"/>` )
    }

    let theme_css = `${theme}.css`;
    if ( $( `link[href="${theme}.css"]`).length == 0 ) {
        head.append( 
            `<link href="${theme}.css" rel="stylesheet"/>` )
    }

    if ( $( `script[src="supplescroll.min.js"]`).length == 0 ) {
        body.append( `<script src="supplescroll.min.js"></script>` )
    }

    return $.html()
}


function processFile( fname, theme, outFname ) {
    let outDir = path.dirname( outFname );

    let html = fs.readFileSync( fname )
        .toString();

    if ( path.extname( fname )
        .toLowerCase() == '.md' ) {
        html = convertMarkdownToHtml( html )
    }

    html = insertIncludes( html, theme );
    fs.writeFile( outFname, html );

    console.log( `${outFname}` );

    let bases = [
        'supplescroll.min.js',
        'supplescroll.css',
        theme + '.css'
    ];
    for ( let base of bases ) {
        let inFname = path.join( __dirname, 'supplescroll', base );
        let outFname = path.join( outDir, base );
        fs.copy( inFname, outFname );
        console.log( ` - ${inFname} -> ${outFname}` )
    }
}


let doc = `
Turn plain markdown/html into interactive 3-column articles

Usage: supplescroll.js [-o outhtml] markdown|html theme
    
  - themes: light, dark, yeolde, clown, sphinx

`;


if ( process.argv.length < 3 ) {

  console.log(doc);

} 
else {

    let knownOpts = {
        "out": [String, null]
    }
    let shortHands = {
        "o": ["--out"]
    }

    let parsed = nopt(knownOpts, shortHands, process.argv, 2)
    let remain = parsed.argv.remain
    const fname = remain[0];

    let theme = 'dark';
    if ( remain.length > 1 ) {
        theme = remain[1];
    } 

    let outFname;
    if (parsed.out) {
        outFname = parsed.out
    }
    else {
        outFname = fname.replace('.md', '.html');
    }

    processFile(fname, theme, outFname);

}





