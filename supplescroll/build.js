// supplescroll.js: make supplescroll from a markdown file

"use strict"

var fs = require( "fs" )
var path = require( "path" )

var marked = require( "marked" )
var yaml = require( "js-yaml" )
var mustache = require( "mustache" )
var cheerio = require( "cheerio" )


function copyFile( source, target, callback ) {
    var callbackCalled = false;

    function done( err ) {
        if ( !callbackCalled ) {
            callback( err );
            callbackCalled = true;
        }
    }

    if ( !fs.existsSync( source ) ) {
        throw new Error( `${source} not found` );
    }

    var read = fs.createReadStream( source );
    read.on( "error", ( e ) => {
        done( e );
    } );

    var write = fs.createWriteStream( target );
    write.on( "error", ( e ) => {
        done( e );
    } );
    write.on( "close", ( e ) => {
        done();
    } );

    read.pipe( write );

}


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
</html>`


function splitByFirstDivider( s ) {

    let linesList = [[], []]
    let isFirst = true
    for (let line of s.split(/\r?\n/)) {
        if (isFirst) {
            if (line.match(/^---/)) {
                isFirst = false
            }
            else {
                linesList[0].push(line)
            }
        }
        else {
            linesList[1].push(line)
        }
    }

    let result = []
    for (let lines of linesList) {
        let piece = lines.join("\n")
        if (piece) {
            result.push( piece )
        }
    }
    return result

}


function convertMarkdown( markdownText ) {
    let page = {
        'banner': '',
        'is_rename': true,
        'title': ''
    }
    let parts = splitByFirstDivider( markdownText )
    let content;
    if (parts.length === 1) {
        content = parts[0]
    }
    else {
        content = parts[1]
        let yamlText = parts[ 0 ]
        if (yamlText.length > 0 ) {
            let read_page = yaml.safeLoad( parts[ 0 ] )
            for (var key in read_page){
                page[key] = read_page[key];
            }
        }
    }
    page[ 'content' ] = marked( content )
    return mustache.render( template, page )
}


function insertIncludes( html, theme ) {
    let $ = cheerio.load( html )

    let root = $.root()

    let body = $( 'body' )
    if ( body.length == 0 ) {
        body = root
    }

    let head = $( 'head' )
    if ( head.length == 0 ) {
        head = root
    }

    if ( $( 'link[href="supplescroll.css"]').length == 0 ) {
        head.append( 
            `<link href="supplescroll.css" rel="stylesheet"/>` )
    }

    let theme_css = `${theme}.css`
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
    let outDir = path.dirname( outFname )

    let html = fs.readFileSync( fname )
        .toString()

    if ( path.extname( fname )
        .toLowerCase() == '.md' ) {
        html = convertMarkdown( html )
    }

    html = insertIncludes( html, theme )
    fs.writeFile( outFname, html )

    console.log( ` - ${outFname}` )

    let bases = [
        'supplescroll.min.js',
        'supplescroll.css',
        theme + '.css'
    ]
    for ( let base of bases ) {
        let inFname = path.join( __dirname, base )
        let outFname = path.join( outDir, base )
        copyFile( inFname, outFname, () => {} )
        console.log( ` - ${inFname} -> ${outFname}` )
    }
}


module.exports = { processFile }



