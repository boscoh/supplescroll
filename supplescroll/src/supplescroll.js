

// Supplescroll
// 1. integrated Table of Contents
// 2. integrated figures
// 3. linked list of figures
// 4. clean resizing of columns
// 5. touchscroll for elems
// js-beautify -good-stuff -j -P -w 70 supplescroll.js > supplescroll.pretty.js




import $ from 'jquery';
import scrollto from 'jquery.scrollto';
import css from './supplescroll.css';



function exists( obj ) {
    if ( typeof obj === "undefined" ) {
        return false;
    }
    return obj !== null;
}



// convenience functions for jquery dom objects

function set_outer_height( div, height ) {
    let margin = div.outerHeight( true ) - div.innerHeight()
    margin += parseInt( div.css( 'padding-top' ) )
    margin += parseInt( div.css( 'padding-bottom' ) )
    div.height( height - margin )
}

function set_outer_width( div, width ) {
    let margin = div.outerWidth( true ) - div.innerWidth()
    margin += parseInt( div.css( 'padding-left' ) )
    margin += parseInt( div.css( 'padding-right' ) )
    div.width( width - margin )
}

function get_outer_width( div ) {
    return div.outerWidth( true )
}

function get_spacing_width( div ) {
    return get_outer_width( div ) - get_content_width( div )
}

function get_outer_height( div ) {
    return div.outerHeight( true )
}

function get_content_width( div ) {
    let width = div.innerWidth()
    width -= parseInt( div.css( 'padding-left' ) )
    width -= parseInt( div.css( 'padding-right' ) )
    return width
}

function get_content_height( div ) {
    let height = div.innerHeight()
    height -= parseInt( div.css( 'padding-top' ) )
    height -= parseInt( div.css( 'padding-bottom' ) )
    return height
}

function get_bottom( div ) {
    return div.position().top + div.outerHeight( true )
}

function get_right( div ) {
    return div.position().left + div.outerWidth( true )
}

function get_top( div ) {
    return div.position().top
}

function get_left( div ) {
    return div.position().left
}

function set_top( div, top ) {
    div.css( 'top', top )
}

function set_left( div, left ) {
    div.css( 'left', left )
}

function init_touchscroll() {

    // block whole document from bouncing
    $( document ).on(
        'touchmove', e => {
            e.preventDefault()
        } )

    // but allow elements with .touchscroll to bounce
    $( 'body' ).on(
        'touchmove', '.touchscroll', e => {
            e.stopPropagation()
        } )

    // stop body from triggering page bounce
    $( 'body' ).on(
        'touchstart',
        '.touchscroll', ( e ) => {
            // find dom-elem of e and scroll it 
            // away from top/bottom extremities
            let target = e.currentTarget
            let bottom = target.scrollTop + target.offsetHeight
            if ( target.scrollTop == 0 ) {
                target.scrollTop = 1
            } else if ( target.scrollHeight == bottom ) {
                target.scrollTop -= 1
            }
        }
    )

}



class FigureList {

    // note: this.text_href must be 'position:relative'

    constructor( toc_href, text_href, figlist_href ) {

        // no horiziontal auto scrolling
        $.scrollTo.defaults.axis = 'y'

        this.toc_href = toc_href
        this.text_href = text_href
        this.figlist_href = figlist_href

        this.text = $( this.text_href )
        this.figlist = $( this.figlist_href )
        this.toc = $( this.toc_href )

        this.scroll_offset = -15

        // initialize properties
        this.selected_figlink = null
        this.selected_header = null
        this.selected_headerlink = null
        this.is_autodetect_figlink = true
        this.is_autodetect_header = true
        this.headers = []
        this.figlinks = []

        this.text.append(
            $( '<div>' )
                .addClass( 'page-filler' )
        )

        if ( this.figlist_href !== '' ) {
            this.transfer_figs()
            this.make_reflinks()
            this.make_figlinks()
            this.figlist.append(
                $( '<div>' )
                    .addClass( 'page-filler' ) )
        }

        if ( this.toc_href !== '' ) {
            this.make_toc()
            this.toc.append(
                $( '<div>' )
                    .addClass( 'page-filler' ) )
        }

        this.text.scroll( () => this.scroll_in_text() )

        // handle initial hash code
        let hash = window.location.hash
        if ( hash.slice( 0, 7 ) == '#header' ) {
            this.select_header( $( hash ) )
        } 
        else if ( hash.slice( 0, 4 ) == '#fig' ) {
            for ( var figlink of this.figlinks ) {
                if ( figlink.attr( 'href' ) == hash ) {
                    let fig = $( hash )
                        // wait till all assets have been loaded!
                    fig.ready( this.make_select_figlink_fn( figlink ) )
                }
            }
        } 
        else if ( hash.slice( 0, 4 ) == '#ref' ) {
            for ( let reflink of this.reflinks ) {
                if ( reflink.attr( 'href' ) == hash ) {
                    let ref = $( hash )
                        // wait till all assets have been loaded!
                    ref.ready( this.make_select_figlink_fn( reflink ) )
                }
            }
        }
    }

    is_onscreen( div ) {

        let x1 = this.text.offset().top
        let x2 = x1 + this.text.height()
        let y1 = div.offset().top + this.scroll_offset
        let y2 = y1 + div.outerHeight( true ) + this.scroll_offset
        if ( x1 <= y1 && y1 <= x2 )
            return true
        if ( x1 <= y2 && y2 <= x2 )
            return true
        if ( y1 <= x1 && x1 <= y2 )
            return true
        if ( y1 <= x2 && x2 <= y2 )
            return true
        return false

    }

    make_toc() {
        let div = $( '<div>' ).addClass( 'toc' )
        this.toc.append( div )

        let n_header = 1
        this.headers = []
        this.headerlinks = {}
        for ( let header_dom of $.makeArray( this.text.find(
                'h1, h2, h3, h4' ) ) ) {
            // give the header an id to link against
            let header = $( header_dom )
            let header_id = 'header' + n_header
            n_header += 1
            header.attr( 'id', header_id )
            this.headers.push( header )

            // create a link in the toc
            let header_href = '#' + header_id
            let headerlink = $( '<a>' ).attr( 'href', header_href )
            headerlink.append( header.clone().attr( 'id', '' ) )
            this.headerlinks[ header_id ] = headerlink
            headerlink.click( 
                this.make_scroll_to_href_in_text_fn(
                    header_href, 
                    () => this.select_onscreen_figlink_and_figure() 
                ) 
            )
            div.append( headerlink )
        }
    }

    transfer_figs() {

        // in this.text_href, move all <div id='fig*'> into this.figlist_href
        let num_fig = 1
        for ( let div_dom of $.makeArray( this.text.find(
                'div' ) ) ) {
            let div_id = $( div_dom ).attr( 'id' )
            if ( exists( div_id ) && div_id.substring( 0, 3 ) ==
                'fig' ) {
                let div = $( div_dom )
                div.prepend( '(Figure ' + num_fig + '). ' )
                    // div.prepend(' ')
                let new_div = div.clone()
                div.addClass( 'fig-in-text' )
                new_div.addClass( 'fig-in-figlist' )
                this.figlist.append( new_div )
                num_fig += 1
            }
        }
    }

    make_figlinks() {
        // in this.figlist_href, for <div id='fig*'>, assign label 'Figure.//'
        this.i_fig_dict = {}
        this.fig_hrefs = []
        this.fig_href_from_orig = {}
        this.fig_label_dict = {}
        this.figlinks = []

        // find all figures in the figlist, && change their id's to figure{n}
        let n_fig = 1
        for ( var fig_div_dom of $.makeArray( this.figlist
                .find( 'div' ) ) ) {
            let fig = $( fig_div_dom )
            let fig_id = fig.attr( 'id' )
            if ( exists( fig_id ) && fig_id.substring( 0, 3 ) ==
                'fig' ) {
                let orig_fig_href = '#' + fig_id
                let new_fig_href = '#figure' + n_fig
                this.fig_href_from_orig[ orig_fig_href ] =
                    new_fig_href
                this.i_fig_dict[ new_fig_href ] = n_fig
                this.fig_hrefs.push( new_fig_href )
                this.fig_label_dict[ new_fig_href ] = $( '<span>' )
                fig.attr( 'id', 'figure' + n_fig )
                n_fig += 1
            }
        }

        // find all figlinks, && set their href's && id's
        let n_figlink = 1
        this.figlinks = []
        for ( let figlink_dom of $.makeArray( this.text
                .find( 'a[href*="fig"]' ) ) ) {
            let figlink = $( figlink_dom )

            // make an ID for a figlink so backlinks can point to it
            let figlink_id = 'figlink' + n_figlink
            figlink.attr( 'id', figlink_id )
            figlink.addClass( 'figlink' )
            figlink.click( this.make_select_figlink_fn( figlink ) )

            let orig_fig_href = figlink.attr( 'href' )

            if ( orig_fig_href in this.fig_href_from_orig ) {
                // figure out from the figlink what figure it points
                // to and what the new figure id is
                let fig_href = this.fig_href_from_orig[
                    orig_fig_href ]
                let i_fig = this.i_fig_dict[ fig_href ]

                // figlink_label = 'Figure ' + i_fig + '&rArr;'
                // figlink.html(figlink_label)
                let figlink_label = '(Figure ' + i_fig +
                    ')&rArr;'
                figlink.html( figlink_label )
                figlink.attr( 'href', fig_href )

                let figlink_href = '#' + figlink_id
                let reverse_link = $( '<a>' ).append( '&lArr;' ).attr(
                    'href', figlink_href )
                let select_fig_fn = this.make_select_figlink_fn(
                    figlink )
                let finish = () => {
                    select_fig_fn()
                    window.location.hash = this.selected_figlink
                        .attr( 'href' )
                }
                let click_fn = this.make_scroll_to_href_in_text_fn(
                    figlink_href, select_fig_fn )
                reverse_link.click( click_fn )

                this.figlinks.push( figlink )
                this.fig_label_dict[ fig_href ].append(
                    reverse_link )
                n_figlink += 1
            }
        }

        if ( this.figlinks[ 0 ] )
            this.select_figlink( this.figlinks[ 0 ] )

        for ( var i = 0; i < this.fig_hrefs.length; i += 1 ) {
            let fig_href = this.fig_hrefs[ i ]
            let num_fig = i + 1
            let fig_label = this.fig_label_dict[ fig_href ]
            $( fig_href ).prepend( fig_label )
        }
    }

    make_reflinks() {
        this.ref_hrefs = []
        this.ref_label_dict = {}
        this.reflinks = []

        // find all figures in the figlist, and change their id's to figure{n}
        for ( let ref_div_dom of $.makeArray( this.figlist
                .find( 'a' ) ) ) {
            let ref = $( ref_div_dom )
            let ref_id = ref.attr( 'id' )
            if ( exists( ref_id ) && ref_id.substring( 0, 4 ) ===
                'ref-' ) {
                let ref_href = '#' + ref_id
                this.ref_hrefs.push( ref_href )
                    // initialize DOM object for reverse_links
                this.ref_label_dict[ ref_href ] = $( '<span>' )
            }
        }

        // find all reflinks, set their href's and id's
        let n_reflink = 1
        for ( let reflink_dom of $.makeArray( $( this.text_href )
                .find( 'a[href*="ref"]' ) ) ) {
            let reflink = $( reflink_dom )

            // make an ID for a reflink so backlinks can point to it
            let reflink_id = 'reflink' + n_reflink
            reflink.attr( 'id', reflink_id )
            reflink.append( '&rArr;' )
            reflink.addClass( 'reflink' )
            reflink.click( this.make_select_figlink_fn( reflink ) )
            this.reflinks.push( reflink )
            n_reflink += 1

            // check for actural ref's pointed to by reflink
            // and makes a dangling DOM object for a reverse_link
            let ref_href = reflink.attr( 'href' )
            if ( this.ref_hrefs.indexOf( ref_href ) !== -1 ) {
                let reflink_href = '#' + reflink_id
                let reverse_link = $( '<a>' ).append( '&lArr;' ).attr(
                    'href', reflink_href )
                let click_fn = this.make_scroll_to_href_in_text_fn(
                    reflink_href, () => {} )
                reverse_link.click( click_fn )
                this.ref_label_dict[ ref_href ].append(
                    reverse_link )
            }
        }

        for ( let ref_href of this.ref_hrefs ) {
            let ref = this.figlist.find( ref_href )
            let ref_label = this.ref_label_dict[ ref_href ]
            ref.parent().prepend( ' ' )
            ref.parent().prepend( ref_label )
        }
    }

    select_figlink( figlink ) {
        if ( this.selected_figlink == figlink )
            return
        if ( this.selected_figlink !== null ) {
            this.selected_figlink.removeClass( 'active' )
            let selected_fig_href = this.selected_figlink.attr(
                'href' )
            $( selected_fig_href ).removeClass( 'active' )
        }
        this.selected_figlink = figlink
        this.selected_figlink.addClass( 'active' )
        let selected_fig_href = this.selected_figlink.attr(
            'href' )
        $( selected_fig_href ).addClass( 'active' )
    }

    scroll_to_next_figlink() {
        if ( this.figlist.css( 'display' ) == 'none' ) {
            var target = this.text
        } else {
            var target = this.figlist
        }
        this.select_figlink( this.next_figlink )
        target.stop(true)
        target.scrollTo( 
            this.selected_figlink.attr( 'href' ), 
            500, 
            { offset: { top: this.scroll_offset } } 
        )
    }

    select_figlink_and_scroll_to_fig( figlink ) {
        this.next_figlink = figlink
        if ( this.selected_figlink == this.next_figlink ) {
            return
        }
        this.scroll_to_next_figlink()
    }

    make_select_figlink_fn( figlink ) {
        return ( e ) => {
            if ( exists(e) && exists( e.preventDefault))
                e.preventDefault()
            this.select_figlink_and_scroll_to_fig( figlink )
        }
    }

    select_header( header ) {
        this.selected_header = header
        let header_id = header.attr( 'id' )

        // deselect old header in toc
        if ( this.selected_headerlink !== null ) {
            this.selected_headerlink.removeClass( 'active' )
        }

        // make header active
        this.selected_headerlink = this.headerlinks[ header_id ]
        this.selected_headerlink.addClass( 'active' )

        let hash = '#' + header_id
        // window.location.hash = hash
        // if ( history.pushState ) {
        //     var o = {}
        //     history.pushState( o, "", hash )
        // } else {
        //     window.location.hash = hash
        // }
    }

    scroll_to_href_in_text( href, callback ) {
        let settings = {
            onAfter: callback,
            offset: {
                top: this.scroll_offset
            }
        }
        this.text.stop(true)
        this.text.scrollTo( href, 500, settings )
    }

    make_scroll_to_href_in_text_fn( href, callback ) {
        return ( e ) => {
            e.preventDefault()
            this.scroll_to_href_in_text( href, callback )
        }
    }

    select_onscreen_figlink_and_figure() {

        // check if this.selected_figlink is onsceen
        if ( exists( this.selected_figlink ) ) {
            if ( this.is_onscreen( this.selected_figlink ) ) {
                return
            }
        }

        // check if this.selected_figlink is onsceen
        let onscreen_figlink = null
        for ( var figlink of this.figlinks ) {
            if ( this.is_onscreen( figlink ) ) {
                onscreen_figlink = figlink
                break
            }
        }
        if ( exists( onscreen_figlink ) ) {
            this.select_figlink_and_scroll_to_fig(
                onscreen_figlink )
        }
    }

    select_onscreen_header() {

        // check for onscreen header, && update toc
        // no big changes, so can always run
        let onscreen_header = null
        for ( var header of this.headers ) {
            if ( this.is_onscreen( header ) ) {
                onscreen_header = header
                break
            }
        }

        if ( exists( onscreen_header ) ) {
            if ( this.selected_header !== onscreen_header ) {
                this.select_header( onscreen_header )
            }
        }
    }

    scroll_in_text() {
        // this.text must be position:relative to work
        this.select_onscreen_header()
        if ( this.is_autodetect_figlink ) {
            this.select_onscreen_figlink_and_figure()
        }
    }

}



class Page {

    constructor() {

        let body = $('body')

        let banner = null;

        let children = []
        for (let child of $.makeArray(body.contents())) {
            if ( $(child).attr('id') === "banner" ) 
                banner = child
            else 
                children.push(child);
            $(child).detach();
        }

        body.append(`
            <div id="navbar">
                <div id="toc-trigger">
                    <div id="hamburger"></div>
                </div>
            </div>
            <div id="table-of-contents" class="touchscroll">
            </div>
            <div id="main-text" class="touchscroll">
                <div id="insert" class="relative_position">
                </div>
            </div>
            <div id="figure-list" class="touchscroll">
            </div>  
            <div id="divider1"></div>
            <div id="divider2"></div>
        `)

        this.navbar = $( '#navbar' )
        this.trigger = $( '#toc-trigger' )
        this.toc = $( '#table-of-contents' )
        this.text = $( '#main-text' )
        this.figlist = $( '#figure-list' )
        this.divider1 = $( '#divider1' )
        this.divider2 = $( '#divider2' )

        var insert = $( '#insert' )
        for (let child of children) {
            insert.append(child)
        }

        if ( exists( banner)) {
            this.navbar.append( banner );
        }
        this.trigger.click( () => { this.activate_trigger() } )

        this.isDrag = 0;
        this.divider1.mousedown( (e) => { this.isDrag = 1; } )
        this.divider2.mousedown( (e) => { this.isDrag = 2; } )
        body.mouseup( (e) => { this.isDrag = 0; } )
        body.mousemove( (e) => this.mousemove( e ) )

        this.divider1.width(5)
        this.divider2.width(5)
        this.divider1.css('z-index', 2000)
        this.divider2.css('z-index', 2000)
        this.divider1.css('cursor', 'col-resize')
        this.divider2.css('cursor', 'col-resize')
        this.trigger.css( 'z-index', 1000 )
        this.toc.css( 'z-index', 700 )
        this.text.css( 'z-index', 500 )
        this.figlist.css( 'z-index', 0 )

        this.two_column_width = 1200
        this.one_columnn_width = 480
        this.max_youtube_video_width = 500
        this.toc_width = 250
        this.text_width = 450
        this.split_diff = 0
        this.youtube_video_ratio = 9 / 16

        init_touchscroll()

        let figure_list = new FigureList( 
            '#table-of-contents', 
            '#main-text', 
            '#figure-list' )

        $( window ).resize( () => this.resize_window() )
        this.resize_window()

    }

    mousemove(e) {
        if ( this.isDrag === 0 )
            return
        if ( this.get_n_column() == 3 ) { 
            if ( this.isDrag === 1 ) {
                this.toc_width = e.clientX;
            }
            else if ( this.isDrag === 2 ) {
                this.text_width = e.clientX - this.toc_width;
            }
            this.resize_window()
            e.preventDefault()
        }
        if ( this.get_n_column() == 2 ) { 
            if ( this.isDrag === 2 ) {
                var window_width = $( window ).width()
                var half_window_width = window_width / 2
                console.log( e.clientX, this.split_diff, half_window_width )
                this.split_diff = half_window_width - e.clientX;
                this.resize_window()
                e.preventDefault()
            }
        }
    }

    get_n_column() {
        let window_width = $( window ).width()
        if ( window_width <= this.one_columnn_width )
            return 1
        if ( window_width <= this.two_column_width )
            return 2
        return 3
    }

    is_active_trigger_toc() {
        return this.trigger.hasClass( 'active' )
    }

    toggle_trigger() {
        if ( this.is_active_trigger_toc() )
            this.trigger.removeClass( 'active' )
        else
            this.trigger.addClass( 'active' )
    }

    activate_trigger() {
        this.toggle_trigger()
        if ( this.get_n_column() < 3 ) {
            let width = this.get_trigger_toc_width()
            if ( this.is_active_trigger_toc() ) {
                var move_css = {
                    left: "+=" + width
                }
            } 
            else {
                var move_css = {
                    left: "-=" + width
                }
            }
            for ( let div of[ this.toc, this.text, this.navbar,
                    this.figlist ] )
                div.animate( move_css, 300 )
        }
    }

    get_trigger_toc_width() {
        let window_width = $( window ).width()
        let trigger_width = parseInt( 1.5 * get_outer_width( this
            .trigger ) )
        if ( this.get_n_column() == 2 )
            return Math.round( window_width / 2 ) - trigger_width
        else if ( this.get_n_column() == 1 )
            return window_width - trigger_width
    }

    make_resize_fn( img_dom, width ) {
        return () => {
           let img = $( img_dom )
           if ( img.hasClass( 'inline-graphic' ) )
               return
           if ( img_dom.naturalWidth > 0 && img_dom.naturalWidth < width )
               img.css( 'width', '' )
           else
               img.css( 'width', '100%' )
        }
    }

    resize_imgs_in_figlist() {
        var figlist_width = this.figlist.width()
        for ( let img_dom of $.makeArray( $( 'img' ) ) ) {
            let img = $( img_dom )
            let parent = img.parent()
            let parent_width = figlist_width - get_spacing_width( parent ) 
            let resize_fn = this.make_resize_fn( img_dom, parent_width )
            if ( !img_dom.complete ) {
                img.load( resize_fn )
            } else {
                resize_fn()
            }
        }
    }

    resize_youtube_iframe( iframe ) {
        var parent = iframe.parent()
        var width = get_outer_width(parent) - get_spacing_width(parent)
        if ( width > this.max_youtube_video_width ) {
            width = this.max_youtube_video_width
        }
        var height = width * this.youtube_video_ratio
        iframe.width( width )
        iframe.height( height )
   }

    resize_window() {
        var window_width = $( window ).width()
        var window_height = $( window ).height()
        var body = $( document.body )
        var body_padding_left = parseInt( body.css(
            'padding-left' ) )
        var body_padding_right = parseInt( body.css(
            'padding-right' ) )
        var navbar_height = get_outer_height( this.navbar )

        if ( this.is_active_trigger_toc() )
            this.toggle_trigger()
        if ( this.get_n_column() == 3 ) {
            set_left( this.navbar, body_padding_left )
            set_outer_width( this.navbar, window_width -
                body_padding_left - body_padding_right )
        } else {
            set_left( this.navbar, 0 )
            set_outer_width( this.navbar, window_width )
        }

        if ( this.get_n_column() < 3 )
            this.trigger.show()
        else
            this.trigger.hide()

        var height = window_height - navbar_height
        var divs = [ this.toc, this.figlist, this.text, 
            this.divider1, this.divider2 ]
        for ( let div of divs ) {
            set_top( div, navbar_height )
            set_outer_height( div, height )
        }

        // move toc around
        if ( this.get_n_column() < 3 ) {
            set_top( this.toc, 0 )
            set_outer_height( this.toc, window_height )
            var width = this.get_trigger_toc_width()
            set_left( this.toc, -width )
            set_outer_width( this.toc, width )
        } else if ( this.get_n_column() == 3 ) {
            set_left( this.toc, body_padding_left )
            set_outer_width( this.toc, this.toc_width )
        }


        // set text and figlist
        if ( this.get_n_column() == 1 ) {
            this.figlist.hide()
            set_left( this.text, 0 )
            set_outer_width( this.text, window_width )
            var figlist_width = window_width
        } 
        else if ( this.get_n_column() == 2 ) {
            this.figlist.show()
            let half_window_width = Math.round( window_width / 2 )
            let text_width = half_window_width - this.split_diff
            set_left( this.text, 0 )
            set_outer_width( this.text, text_width )
            var figlist_width = window_width - text_width
            set_left( this.divider2, text_width - 5)
            set_left( this.figlist, text_width )
            set_outer_width( this.figlist, figlist_width )
        } 
        else { // three columns
            this.figlist.show()
            set_outer_width( this.text, this.text_width )
            var left = get_right( this.toc )
            set_left( this.text, left )
            set_left( this.divider1, left)
            left = get_right( this.text )
            set_left( this.divider2, left)
            set_left( this.figlist, left )
            var figlist_width =
                  window_width 
                - body_padding_left 
                - body_padding_right 
                - get_outer_width( this.toc ) 
                - get_outer_width( this.text )
            set_outer_width( this.figlist, figlist_width )
        }

        // resize youtube videos
        if ( this.get_n_column() == 1 ) {
            for (let iframe_dom of $.makeArray( $( '.fig-in-text iframe[src*="youtube.com"]' ) ) )
                this.resize_youtube_iframe( $(iframe_dom) )
        } 
        else {
            for (let iframe_dom of $.makeArray( $( '.fig-in-figlist iframe[src*="youtube.com"]' ) ) )
                this.resize_youtube_iframe( $(iframe_dom) )
        }

        // resize images
        if ( this.get_n_column() > 1 ) {
            this.resize_imgs_in_figlist()
        }
    }

}


$( window ).ready( () => {
    var page = new Page()
} )





