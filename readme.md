template: perspex.haml
title: supplescroll
---
---



# SUPPLESCROLL

_scrolling articles to your heart's delight_



`supplescroll` is a javascript plugin that builds a table of contents and Figure List dynamically from an article webpage, and binds them together through interactive links and supple scrolling.

Features:

- table of contents generated from headers `<h1>`'s etc.
- Figure List generated from `<div>`s marked with `id="fig*"`
- links to figures autoscrolls the Figure List
- back links of figures to references in text
- scroll-aware table of contents
- the URL hashes respond to the text
- responsive-web-design themes that enable iOS touch



## Installation

Downlaoad the [zip](http://github.com/boscoh/supplescroll/master/zip) file from github.

`supplescroll` was inspired by, and uses Ariel Flesier's lovely [jquery.ScrollTo](http://plugins.jquery.com/project/ScrollTo) library, which is a [jquery](http://jquery.com/) plugin.




## Write Article with Embellish

The easiest way to use `supplescroll` is to compile your article with the static website generator [embellish](http://boscoh.github.com/embellish).

To write the article, use the YAML/markdown format, for example in [](#fig-markdown).


<div id="fig-markdown"> <code>example.txt</code> - example of an article in supplescroll
<pre>
template: lucid.haml
--- 
--- 
# This is my Article in markdown

I will talk about a code fragment [](#fig-code-fragment).

&lt;div id=&quot;fig-code-fragment&quot;&gt; A Code Fragment
  &lt;pre&gt;Hello World&lt;/pre&gt;
&lt;/div&gt;
</pre>
</div>


The format consists of a: 

1. header in [YAML](http://www.keleshev.com/yaml-quick-intoduction)
2. an excerpt
2. body in [markdown](https://daringfireball.net/projects/markdown/basics)

In the header, give the name of a `supplesscroll` template you want to use:

    template: lucid.haml

There are two templates provided that you can use with `supplescroll`: `lucid` and `pesrpex`.

For embellish to work, two lines of: `---` are needed to separate the header and excerpt from the main body. Whilst the second is optional, it's confusing to `embellish` if there are any other `---` lines in the text.

Write the text in markdown, making sure to use proper markdown headers, which will be used to construct the Table of Contents:

    # A Header
    ## A Secondary Header

To create a figure, you must escape markdown with a `<div>` tag, and give the `<div>` an appropriate `id`:

    <div id='fig-code'>
    <code><pre>Hello World</pre></code>
    </div>

Note: make sure you escape the characters properly if using HTML special characters such as `<`, `&` etc. Use an HTML-escape sanitizer.

In the main text, links to figures will be properly formatted, they are written:

    I will talk about a code fragment [](#fig-code-fragment).

Now that the article is finished, you can compile the website with: 

     > embellish .

The article, using the `lucid` theme consists of the files:

- example.html
- jquery-2.0.3.js
- jquery.scrollTo.js
- supplescroll.js
- supplescroll.css
- lucid.css
- lucid.js



## Write Article directly in HTML

Of course, you don't have to use `embellish` to build your HTML file, you can write it yourself. To use the `lucid` theme, you'd make an HTML file like `article.html` [](#fig-html).


<div id='fig-html'> <code>article.html</code> - a hand-coded HTML article page that works with the lucid theme.
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
&lt;script src='lucid.js' type='text/javascript'&gt;&lt;/script&gt;
</pre>
</div>

The text of course will be written using HTML markup, with `<p>` tags and `<i>` tags and such impediments to writing.

As above, header tags `<h1>`'s etc., will be used to build the table of contents:

    <h1> This is My Article Header </h1>

Any `<div>`s with `id="fig*"` will be copied into the Figure List.

    <div id="fig-code-fragment"> A Code Fragment
      <pre>Hello World</pre>
    </div>

This is essentially what is generated with `embellish` in the section above.




## Theme it Yourself

If you are familiar with HTML/CSS/javascript, you might want to theme your templates for `supplescroll`. To do this, you'll have to understand some of the internals of `supplescroll` so that all the HTML elements can happily work together. Naturally, you will follow how the themes are written, but below, we'll discuss how `supplescroll` w.r.t. the lucid theme.


### Page Loader

Your page needs to initialize `supplescroll` with javascript. In the package, `page.js` provides the entry point. Since `jquery` is included we can use jquery to register our `init` function.

    $(window).ready(init) 
   
<div id="fig-init"> <code>init</code> - page intialization function in coffeescript
<pre>
init = () ->
  text = $(text_href)
  sidebar = $(toc_href)
  figures = $(figlist_href)
  text_width = supplescroll.get_outer_width(text)

  supplescroll.init_touchscroll()
  supplescroll.set_figures_and_toc(
      toc_href, text_href, figlist_href)

  $(window).resize(resize_window)
  resize_window()
</pre>
</div>

The `init` function [](#fig-init):

1. calls the page builder 
2. registers the resize function
3. calls the touchscroll initializer


### Page Builder

The page builder is in the module `supplescroll.js`, which obviously, must be loaded first via the `<script>` tag in the HTML file. The function to build the page is:

    supplescroll.set_figures_and_toc(
        toc_href, text_href, figlist_href)
     
The three parameters are hrefs referring to an element in the DOM of the HTML page. If `toc_href` is empty string, the Table of Contents will not be built. Similarly for `figlist_href`.

The Table of Contents is built from the header elements (`<h1>`, `<h2>` etc.) in the `text_href` and inserted into the element referred to by `toc_href`.

The text is then scanned for figures, which are identified as `<div>`'s that have id's in the form `fig*`. These `<div>`'s are then copied in the Figure List. The original `<div>`'s are hidden, but can be displayed by CSS class changes.

It's important to ensure that each figure `<div>`s has a unique id.

Then the text is scanned for `<a>` links that point to internal href's in the form `#fig*`. These links are linked to the corresponding figures in the Figure List.

The figure `<div>` id's are renamed consecutively from `(figure 1)` onwards.

Finally, the location url is scannd and the initial header is assigned to the hash. 


### Smooth Scrolling with ScrollTo

One of the things that the page builder does is to put in custom callbacks for figure links and links in the table of contents. 

These custom callbacks use the `ScrollTo` plugin to smoothly  scroll to the text or figure of interest.

However, for that to work, the `<div>` container must be sized properly. That is the explicit size of the `<div>` must be smaller than the onscreen window and the CSS attribute `overflow:auto` must be set.

Furthermore, the page builder will add suffcient white-space to the end of these `<div>`s so that scrolling will always take the child element of interest to the top of the `<div>`.


### Scrolling Callback
 
On scrolling, the main text will scan for the first figure link, and if a new one pops up, will scroll the Figure List to the that figure.

The `supplescroll` module overrides the `scroll` callback function in the main text element in order to detect which headers and figures are currently onscreen.

For the `scroll` callback to work, it is __imperative__ that the main text element has the CSS style:

    position: relative

Otherwise, the positions of elements in the main text cannot be calculated correctly.

To do this, wrap the main-text in the HTML with the utility class `.relative_position`


### Overriding the resize function

The themes in `supplescroll` use custom resize functions to resize columns. This is optional, as you could do resizing through CSS.

As a responsible web developer, you might ask, why would you override CSS for resizing?

Well, I wanted multiple columns that spanned the whole page, where some columns had fixed widths, and others would expand to fill the remaining space. As well, I wanted the columns to fill the height of the page, but also to drop certain columns for mobile devices.

Alas, you cannot do all that with CSS. 

So I wrote my own resize function. Here's a snippet for three-column resize [](#fig-resize-3)


<div id="fig-resize-3">
<pre>
sidebar.css('display','block')
figures.css('display','block')

supplescroll.set_outer_width(text, text_width)
supplescroll.set_left(sidebar, page_margin)
left = supplescroll.get_right(sidebar)
supplescroll.set_left(text, left)
figlist_width = window_width - page_margin - page_margin \
    - supplescroll.get_outer_width(sidebar) \
    - supplescroll.get_outer_width(text)
left = supplescroll.get_right(text)
supplescroll.set_left(figures, left)
supplescroll.set_outer_width(figures, figlist_width)
</pre>
</div>

First, we make sure `sidebar` (Table of Contents) and `figures` (Figure List) are switched on with `display:block`. To turn these off in 1-column display, these would be set to `display:none`.

In three column mode, we want the main text to have a fixed width `text_width` for easy reading. 

For the resizing to work, it's important that we set all the elements to `position:absolute`. This allows the `supplescroll` element moving helper functions to work: 

    set_left
    set_top
    get_left
    get_top
    get_right
    get_bottom

You can put elements next to each other, by getting the `get_right` of the first element, and assigning with `set_left` of the second element.

I also found that Firefox sometimes screws up the sizes unless the `<doctype>` in the `<head>` is defined.


### Touchscroll on IOS

Touch-based scrolling of webpages on iOS devices is really nice. However, the default scrolling in iOS does not work well with the `ScrollTo` library. To make it work properly, you need to do two things:

1. add the CSS class `.touchscroll` to elements that you want to scroll
2. call `supplescroll.init_touchscroll()` in the page loader

The `.touchscroll` class enables inertia touch-based scrolling through the `-webkit-overflow-scrolling:touch` attribute, and sets `overflow:auto`. 

`init_touchscroll()` shuts down inertial scrolling of all elements except the ones indicated by `.touchscroll`.

As well `init_touchscroll()` is used avoid another default behavior of iOS. If an element has been scrolled to the edge of its scrolling areathis will trigger the inertial scrolling of its parent, and so on up, until the whole page scrolls. To avoid this `init_touchscroll()` introduces a little hack that prevents any `.touchscroll` element from reaching the edge.