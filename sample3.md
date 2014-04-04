template: lucid.haml
title: supplescroll documentation

---
---



# SUPPLESCROLL

_scrolling articles to your heart's delight_

> Supplescroll is a javascript plugin that dynamically generates an interactive document knitted together with some very supple scrolling.

It turns this documentation in [markdown](https://github.com/boscoh/supplescroll/blob/master/readme.md) into this [interactive webpage](http://boscoh.github.com/supplescroll).

Features:

- table of contents generated from headers
- figure list generated from `<div>`s
- back links of figures to references in text
- smooth scrolling
- table of contents aware of text position
- the URL hashes respond to the text

iOS-aware responsive-web themes:

  - `dark.haml` ([sample](http://boscoh.github.com/supplescroll/index.html))
  - `light.haml` ([sample](http://boscoh.github.com/supplescroll/sample2.html))
  - `lucid.haml` ([sample](http://boscoh.github.com/supplescroll/sample3.html))
  - `yeolde.haml` ([sample](http://boscoh.github.com/supplescroll/sample4.html))
  - `clown.haml` ([sample](http://boscoh.github.com/supplescroll/sample5.html))


## Installation

To install the package, download from github:

&nbsp;&nbsp;&nbsp; [zip-package](https://github.com/boscoh/supplescroll/archive/master.zip)

Then you should install [embellish](http://boscoh.github.io/embellish), which includes a coffeescript and sass compiler. 

Then edit the file `article.md` in markdown, following the guide below.

When you're done, run:

    > embellish .

And open `article.html`.



## Source Code

You can browse the code at

&nbsp;&nbsp;&nbsp; <http://github.com/boscoh/supplescroll>

Please, fork and pull-request. 

New themes particularly welcome!

Supplescroll was inspired by Ariel Flesier's [jquery.ScrollTo](http://plugins.jquery.com/project/ScrollTo) library.



## Write Article with Embellish

The easiest way to use supplescroll is to compile your article with the static website generator [embellish](http://boscoh.github.com/embellish).

To write the article, use the YAML/markdown format, for example in [](#fig-markdown).


<div id="fig-markdown"> <code>article.md</code> - example of an article in supplescroll
<pre>
template: lucid.haml
title: My Article
---
---
# This is my Article in markdown

I will talk about the following things

## Code Fragment
A code fragment [](#fig-code-fragment)
&lt;div id=&quot;fig-code-fragment&quot;&gt; A Code Fragment
  &lt;pre&gt;Hello World&lt;/pre&gt;
&lt;/div&gt;

## A Photo
a photo [](#fig-photo)
&lt;div id='fig-photo'&gt;
  &lt;img src='photo.jpg'&gt;
&lt;/div&gt;

## A Video
a video [](#fig-youtube)
&lt;div id='fig-youtube'&gt;
  Link to youtube
  &lt;br&gt;&lt;br&gt;
  &lt;iframe width=&quot;560&quot; height=&quot;315&quot; src=&quot;http://www.youtube.com/embed/Fk5reVYChlo?list=FLnRk0rt9QwA9a_mmCvlfXDw&amp;start=52&quot; frameborder=&quot;0&quot; allowfullscreen&gt;&lt;/iframe&gt;
&lt;/div&gt;</pre>
</div>


The format consists of a: 

1. header in [YAML](http://www.keleshev.com/yaml-quick-intoduction)
2. an excerpt
2. body in [markdown](https://daringfireball.net/projects/markdown/basics)

In the header, give the name of a supplescroll template you want to use:

    template: lucid.haml

There are several templates provided in the package:

  - `dark.haml` ([sample](http://boscoh.github.com/supplescroll/index.html))
  - `light.haml` ([sample](http://boscoh.github.com/supplescroll/sample2.html))
  - `lucid.haml` ([sample](http://boscoh.github.com/supplescroll/sample3.html))
  - `yeolde.haml` ([sample](http://boscoh.github.com/supplescroll/sample4.html))
  - `clown.haml` ([sample](http://boscoh.github.com/supplescroll/sample5.html))

For embellish to work, two lines of: `---` are needed to separate the header and excerpt from the main body. Whilst the excerpt is optional, to avoid potential bugs with `---` later in the text, I'd suggest:
    
    template: lucid.haml
    ---
    ---



### Headers

Write the text in markdown, making sure to use proper markdown headers, which will be used to construct the table of contents:

    # A Header
    ## A Secondary Header


### Code and Code Blocks

The way that styles are structured, use `<pre>` for a multi-line block, and `<code>` for inline references. In particular `<pre>` blocks have been styled to not exceed the widths of the main text column. If the internal width of the main text column is too wide then the Scroll.To module will cause unseemly horizontal scrolling when scrolling to figure links.


### Figures

To create a figure, you must escape markdown with a `<div>` tag, and give the `<div>` an appropriate `id`:

    <div id='fig-code'> 
      Code Fragment Label
      <pre>Hello World</pre>
    </div>

which gives [](#fig-code). Here, we have an examlple of a code block. Basically, any text before the `<pre>` and `<code>` tags can be used as a figure label.

<div id='fig-code'> 
  Code Fragment Label
  <pre>Hello World</pre>
</div>

Note: if you want to display HTML-code, make sure you escape special HTML characters (`<`, `&`) properly. Use an [HTML-escape sanitizer](http://www.freeformatter.com/html-escape.html).


### Images

You'd probably want to insert a photo:

    <div id='fig-photo'>
      Photo Label <br>
      <img src='photo.jpg'>
    </div>

which would take you here [](#fig-photo). Text before the `<img>` tag works as a figure label.

<div id='fig-photo'> 
  Photo Label <br>
  <img src='photo.jpg'>
</div>


### Youtube Videos

Or how about a youtube video:

    <div id='fig-youtube'>
      Label to Youtube Video
      <br><br>
      <iframe width="560" height="315" src="//www.youtube.com/embed/Fk5reVYChlo?list=FLnRk0rt9QwA9a_mmCvlfXDw&start=52" frameborder="0" allowfullscreen></iframe>
    </div>

which would take you here [](#fig-youtube). Text before the `<img>` tag works as a figure label. The `supplescroll` resize functions knows how to resize embedded youtube videos properly.

<div id='fig-youtube'>
  Label to Youtube Video
  <br><br>
  <iframe src="http://www.youtube.com/embed/Fk5reVYChlo?list=FLnRk0rt9QwA9a_mmCvlfXDw&start=52" frameborder="0" allowfullscreen></iframe>
</div>


### Figure links

In the main text, links to figures are identified as relative links to `#fig*`:

    I will talk about a code fragment [](#fig-code-fragment).

These will be properly formatted, and linked to the relevant figure.


### Compile to HTML

You then compile the page with: 

     > embellish .

Which makes `article.html`. The function webpage, which uses the lucid theme, consists of the files:

- `article.html`
- `jquery-2.0.3.js`
- `jquery.scrollTo.js`
- `supplescroll.js`
- `supplescroll.css`
- `page.js`
- `lucid.css`



## Write Article directly in HTML

Of course, you don't have to use embellish to build your HTML file, you can write it yourself. To use the lucid theme, you'd make an HTML file like `article.html` [](#fig-html).

This shows all the necessary declarations, style-sheets & javascript modules.

<div id='fig-html'> <code>article.html</code> - key ingredients of an HTML article page that works with the lucid theme.
<pre>
&lt;!DOCTYPE html&gt;
&lt;head&gt;
  &lt;meta content='initial-scale=1.0' name='viewport' /&gt;
  &lt;link href='supplescroll.css' rel='stylesheet' /&gt;
  &lt;link href='lucid.css' rel='stylesheet' /&gt;

&lt;/head&gt;
&lt;body&gt;
  &lt;div class='sidebar touchscroll'&gt;&lt;/div&gt;
  &lt;div class='text touchscroll'&gt;
    &lt;div class='relative_position'&gt;

       &lt;!-- YOUR TEXT GOES HERE! --&gt;
       &lt;h1&gt; This is My Article Header &lt;/h1&gt;

       &lt;p&gt;I will talk about a code fragment
       &lt;a href=&quot;#fig-code-fragment&quot;&gt;&lt;/a&gt;&lt;/p&gt;

      &lt;div id=&quot;fig-code-fragment&quot;&gt; A Code Fragment
        &lt;pre&gt;Hello World&lt;/pre&gt;
      &lt;/div&gt;

    &lt;/div&gt;
  &lt;/div&gt;
  &lt;div class='figures touchscroll'&gt;&lt;/div&gt;
&lt;/body&gt;
&lt;script src='jquery-2.0.3.js' type='text/javascript'&gt;&lt;/script&gt;
&lt;script src='jquery.scrollTo.js' type='text/javascript'&gt;&lt;/script&gt;
&lt;script src='supplescroll.js' type='text/javascript'&gt;&lt;/script&gt;
&lt;script src='page.js' type='text/javascript'&gt;&lt;/script&gt;
</pre>
</div>

The text of course will be written using HTML markup, with `<p>` tags and `<i>` tags and such impediments to writing.

As above, header tags `<h1>`'s etc., will be used to build the table of contents:

    <h1> This is My Article Header </h1>

Any `<div>`s with `id="fig*"` will be copied into the figure list.

    <div id="fig-code-fragment"> A Code Fragment
      <pre>Hello World</pre>
    </div>

This is essentially what is generated with `embellish` in the section above.




## Theme it Yourself

If you are familiar with the holy triumvirate of HTML/CSS/javascript, you might want to theme your own templates. To do this, you'll have to understand the internals of supplescroll so that all the HTML elements can happily work together. 

Note: the supplescroll modules are actually written in coffeescript, then compiled to javascript.

Below, we'll discuss how supplescroll works with respect to the `lucid.haml` theme.



### Page Loader

Your page needs to initialize supplescroll with javascript. In the package, `page.js` provides the entry point. Since jquery is included we can use jquery to register our `init` function.

    $(window).ready(init) 
   
<div id="fig-init"> <code>init</code> - page intialization function in coffeescript
<pre>
init = () ->
  text = $(text_href)
  toc = $(toc_href)
  figlist = $(figlist_href)
  text_width = supplescroll.get_outer_width(text)

  supplescroll.init_touchscroll()
  supplescroll.build_page(toc_href, text_href, figlist_href)

  $(window).resize(resize_window)
  resize_window()
</pre>
</div>

The `init` function [](#fig-init):

1. declares page variables
2. calls the page builder 
2. registers the resize function
3. calls the touchscroll initializer



### Page Builder

The page builder is in the module `supplescroll.js`, which obviously, must be loaded first via the `<script>` tag in the HTML file. The function to build the page is:

    supplescroll.build_page(toc_href, text_href, figlist_href)
     
The three parameters are hrefs referring to an element in the DOM of the HTML page. If `toc_href` is empty string, the table of contents will not be built. Similarly for `figlist_href`.

The table of contents is built from the header elements (`<h1>`, `<h2>` etc.) in the `text_href` and inserted into the element referred to by `toc_href`.

The text is then scanned for figures, which are identified as `<div>`'s that have id's in the form `fig*`. These `<div>`'s are then copied in the figure list. The original `<div>`'s are hidden, but can be displayed by CSS class changes.

It's important to ensure that each figure `<div>`s has a unique id.

Then the text is scanned for `<a>` links that point to internal href's in the form `#fig*`. These links are linked to the corresponding figures in the figure list.

The figure `<div>` id's are renamed consecutively from `(figure 1)` onwards.

Finally, the location url is scannd and the initial header is assigned to the hash. 



### Smooth Scrolling with ScrollTo

One of the things that the page builder does is to put in custom callbacks for links, which use the jquery.ScrollTo plugin to smoothly  scroll to the text or figure of interest.

However, for that to work, the `<div>` container must be sized properly. That is the explicit size of the `<div>` must be smaller than the onscreen window and have the CSS attribute

    overflow:auto

Furthermore, the page builder will add suffcient white-space to the end of these `<div>`s so that scrolling will always take the child element of interest to the top of the `<div>`.



### Scrolling Callback
 
The supplescroll module overrides the `scroll` callback function in the main text element in order to detect which headers and figures are currently onscreen. On scrolling, the main text will scan for the first figure link, and if a new one pops up, will scroll the figure list to the that figure.

For the `scroll` callback to work, it is __imperative__ that the main text element has the CSS style:

    position:relative

Otherwise, the positions of elements in the main text cannot be calculated correctly.

To do this, wrap the main-text in the HTML with the utility class `.relative_position`



### Overriding the resize function

The themes in supplescroll use custom resize functions to resize columns. This is optional, as you could do resizing through CSS.

As a responsible web developer, you might ask, why would you override CSS for resizing?

Well, I wanted multiple columns that spanned the whole page, where some columns had fixed widths, and others would expand to fill the remaining space. As well, I wanted the columns to fill the height of the page, but also to drop certain columns for mobile devices.

Alas, you cannot do all that with CSS. 

So I wrote my own resize function. Here's a snippet for three-column resize [](#fig-resize-3)


<div id="fig-resize-3"> Code fragment showing three-column resize
<pre>
toc.css('display','block')
figlist.css('display','block')

# this function allows for some padding in the 
# body to be filter through the resize function
body_padding_left = parseInt($(document.body).css('padding-left'))
body_padding_right = parseInt($(document.body).css('padding-right'))

supplescroll.set_outer_width(text, text_width)
supplescroll.set_left(toc, body_padding_left)

left = supplescroll.get_right(toc)
supplescroll.set_left(text, left)

left = supplescroll.get_right(text)
supplescroll.set_left(figlist, left)

figlist_width = \
    window_width \
    - body_padding_left \
    - body_padding_right \
    - supplescroll.get_outer_width(toc) \
    - supplescroll.get_outer_width(text)
supplescroll.set_outer_width(figlist, figlist_width)
</pre>
</div>

First, we make sure `toc` (table of contents) and `figlist` (figure list) are switched on with `display:block`. To turn these off in 1-column display, these would be set to `display:none`.

In three column mode, we want the main text to have a fixed width `text_width` for easy reading. 

One of the key to manually resizing is to fit the columns exactly onto the width of the window. This will prevent any bouncing effect of the page. This requires first that the CSS of the body and html to:

    body, html {
      width: 100%;
      height: 100%;
      overflow: hidden
    }

Then, we need to set all the resizable elements to `position:absolute`, which will allow the following helper functions to work [](#fig-helper-fns).

<div id="fig-helper-fns">
  <pre>
# routines to get the absolute position of a jquery element
supplescroll.get_left
supplescroll.get_top
supplescroll.get_right
supplescroll.get_bottom

# routines to set the absolute position of a jquery element
supplescroll.set_left
supplescroll.set_top

# routines to get the dimensions of a jquery element
supplescroll.get_outer_width
supplescroll.get_outer_height

# routines to set the dimensions of a jquery element
supplescroll.set_outer_width
supplescroll.set_outer_height
  </pre>
</div>

These helper functions can be used in combination with each other to get perfect placement in the resize function [](#fig-resize-3). For example, by getting the right edge of `toc` by `get_right`, and assigning this right edge to the left edge of `text` with `set_left`, we can place `toc` right next to `text`.

We can also calculate exactly the `figlist_width` needed to fill the remaining space, and assign this to `figlist` via `set_outer_width`.

Finally, the resize function looks for images in the `figlist` and resizes them to fit the column. If the column is big enough, then the image will be displayed at its natural dimensions. Simarly, youtube videos will be resized until it reaches a maximum size. A fixed aspect ratio is applied to all youtube videos.

Note: Firefox sometimes screws up the sizes unless the `<doctype>` in the `<head>` is defined to html.



### Touchscroll on IOS

Touch-based scrolling of webpages on iOS devices is really nice. However, the default scrolling in iOS does not work well with the `ScrollTo` library. To make it work properly, you need to do two things:

1. add the class `.touchscroll` to scrollale elements
2. initialize with `supplescroll.init_touchscroll()` 

The `.touchscroll` class enables inertia touch-based scrolling through the `-webkit-overflow-scrolling:touch` attribute, and sets `overflow:auto`. 

`init_touchscroll()` shuts down inertial scrolling of all elements except the ones indicated by `.touchscroll`. As well, it adds a hack to avoid an unwanted default behavior of iOS. Normally, if an element has been scrolled to the edge of its scrolling area, this will trigger the inertial scrolling of its parent, and so on up, until the whole page scrolls. To avoid this `init_touchscroll()` overrides the `touch` callback with a function that prevents any `.touchscroll` element from reaching its edge.


### Overriding styles

All the selections are displayed through CSS class changes, with the `.active` class applied to the active header in the `#table-of-contents`, the active `.figlink` in the `#main-text`, and the active `.fig-in-list` in `#figure-list`. These classes can be overriden to apply the display of your choice.


&copy; 2014, Bosco K. Ho.

