// supplescroll.js: make supplescroll from a markdown file

"use strict"

var fs = require( "fs" )
var path = require( "path" )

var marked = require( "marked" )
var yaml = require( "js-yaml" )
var mustache = require( "mustache" )
var cheerio = require( "cheerio" )


function splitDivider( s ) {
    let result = []
    let parts = s.split( /\n---/ )
    let n = parts.length
    if ( n === 0 ) {
        result.push( '' )
        result.push( s )
    } else {
        result.push( parts[ 0 ] )
        result.push( parts.slice( 1, n )
            .join( '\n---' ) )
    }
    return result
}


function insertIncludes( html, theme ) {
    let $ = cheerio.load( html )
    $( 'head' )
        .append( `<link href="supplescroll.css" rel="stylesheet"/>` )
    $( 'head' )
        .append( `<link href="${theme}.css" rel="stylesheet"/>` )
    $( 'body' )
        .append( `<script src="supplescroll.min.js"></script>` )
    return $.html()
}


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
    `
<html>
<head>
    <meta content="initial-scale=1.0" name="viewport"/>
    <title>{{ title }}</title>
    <script> window.is_rename = {{is_rename}} </script>
</head>
<body>
    <div id="banner">{{ banner }}</div>
    {{{content}}}
</body>
</html>
`


function convertMarkdown( markdownText ) {
    let parts = splitDivider( markdownText )
    let page = yaml.safeLoad( parts[ 0 ] )
    page[ 'content' ] = marked( parts[ 1 ] )
    return mustache.render( template, page )
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


module.exports = {
    processFile
}