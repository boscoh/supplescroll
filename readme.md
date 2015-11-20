title: supplescroll documentation
banner: supplescroll documentation
---





# SUPPLESCROLL

_scrolling articles to your heart's delight_

> Supplescroll is a javascript plugin that converts a plain HTML document into an interactive document with auto-generated table-of-contents and easy-to-read figures and references.

It turns this [markdown documentation](https://github.com/boscoh/supplescroll/blob/master/readme.md) into this [interactive webpage](http://boscoh.github.com/supplescroll).

Features:

- table of contents generated from headers
- figure list generated from `<div>`s
- back links are generated to figure-links in text
- context aware autoscrolling of figures and toc
- movable dividers of columns
- URL hashes added to all headers
- iOS-aware and responsive-web themes
 
Available themes:

  - `dark` ([sample](index.html))
  - `light` ([sample](sample2.html))
  - `yeolde` ([sample](sample3.html))
  - `clown` ([sample](sample4.html))
  - `sphinx` ([sample](sample5.html))





## Usage

Once the `article.md` [article.md](#fig-markdown) is written, then:

    > supplescroll article.md 

Which makes `article.html`. Open it. To choose another theme with your choice of output:

    > supplescroll -o colorful.html article.md clown





## Installation

To install the package, the easiest is to:

    > pip install supplescroll

Or you could download from github:

&nbsp;&nbsp;&nbsp; [zip-package](https://github.com/boscoh/supplescroll/archive/master.zip)

And install with:

    > python setup.py install

Then edit the file `article.md` in markdown, which is also described below.

When you're done, run:

    > supplescroll article.md

And open `article.html`.





## Source Code

You can browse the code at

&nbsp;&nbsp;&nbsp; <http://github.com/boscoh/supplescroll>

Please fork and pull-request. New themes welcome!





## Write Article with Markdown

`supplescroll` uses a classic YAML/markdown format to convert your documents into HTML. An example is in [article.md](#fig-markdown):

<div id="fig-markdown"> 
	<code>article.md</code> - example of an article in supplescroll
	<pre>

title: My Article in Window Title
banner: My Article Heading in Page
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
&lt;/div&gt;

	</pre>
</div>

The format consists of a: 

1. header in [YAML](http://www.keleshev.com/yaml-quick-intoduction)
2. body in [markdown](https://daringfireball.net/projects/markdown/basics)


### YAML header

The `title` is the text that goes in the Window title. 

The `banner` string is inserted into the banner part of the page.


### Headers

Write the text in markdown, making sure to use proper markdown headers, which will be used to construct the table of contents:

    # A Header
    ## A Secondary Header


### Figures

To create a figure, you must escape markdown with a `<div>` tag, and give the `<div>` an appropriate `id="fig*"`.

The plain text after the `<div>` tag serves as a figure label, and this can be differentiated by latter text that is wrapped in `<pre>` or `<code>` tags.

It is important to note that if you want to display HTML-code, you need to escape special HTML characters (`<`, `&`). You can do this wiht an [HTML-escape sanitizer](http://www.freeformatter.com/html-escape.html).

_Code Blocks_. This is to make large blocks of code that the reader might want to look at with the main text. Use `<pre>` for a multi-line block, and `<code>` for inline references. These will be wrapped in a scrollable style. Make sure you escape HTML tags. Here's an example:

    <div id='fig-code'> 
      Code Fragment Label
      <pre>
      Hello World
      &lt;escaped tag&rt;   </pre>
    </div>

which renders as [Code Fragment](#fig-code).

<div id='fig-code'> 
  Code Fragment 
  <pre>
  Hello World
  &lt;escaped tag&gt;  </pre>
</div>


_Images_. To insert photos with a label, you can add a label as text before the `<img>` tag in the figure:

    <div id='fig-photo'>
      Photo Label <br>
      <img src='photo.jpg'>
    </div>

which gives [Photo Insert](#fig-photo). 

<div id='fig-photo'> 
  Photo Insert <br>
  <img src='photo.jpg'>
</div>

_Youtube Embeds_. Text before the `<img>` tag works as a figure label. `supplescroll` knows how to resize embeds properly:

    <div id='fig-youtube'>
      Label to Youtube Video
      <br><br>
      <iframe width="560" height="315" src="//www.youtube.com/embed/Fk5reVYChlo?list=FLnRk0rt9QwA9a_mmCvlfXDw&start=52" frameborder="0" allowfullscreen></iframe>
    </div>

which renders as [Youtube Embedding](#fig-youtube).

<div id='fig-youtube'>
  Youtube Embedding
  <br><br>
  <iframe src="http://www.youtube.com/embed/Fk5reVYChlo?list=FLnRk0rt9QwA9a_mmCvlfXDw&start=52" frameborder="0" allowfullscreen></iframe>
</div>




### Figure links

In the main text, links to figures are identified as relative links to `#fig*`. To link to the above few figures, we can type:

    - link to code [](#fig-code),  
    - link to photo [](#fig-photo),  
    - link to youtube [](#fig-youtube).

which will generate: 

  - link to code [](#fig-code),  
  - link to photo [](#fig-photo),  
  - link to youtube [](#fig-youtube).



### References

References are similar to figures, in that you can push references into the third column, and back-links are generated. As such you list all your references in a `<div>` for a figure, which is illustrated with this code snippet [](#fig-reference-code). 

Note the references are `<a id="ref*"></a>` tags that are wrapped by a `<div>`. This allows the correct placement of the reference back-link at the beginning of the `<div>`.

In the main text, links to a reference are written:

    Thus some text can be liberally sprinkled  
    with a reference to (google [](#ref-1)),  
    or a reference to (github [](#ref-2)),  
    or a reference to (boscoh [](#ref-3)).

Thus some text can be liberally sprinkled with a reference to (google [](#ref-1)), or a reference to (github [](#ref-2)), or a reference to (boscoh [](#ref-3)).

<div id="fig-reference-code"> 
  example code for references
  <pre>
&lt;div id=&quot;fig-references&quot;&gt;
    &lt;h1&gt;References&lt;/h1&gt;
    &lt;div&gt;
        &lt;a id=&quot;ref-1&quot;&gt;&lt;/a&gt;This is the detail to the linked reference, maybe it's a link&lt;a href=&quot;http://boscoh.com&quot;&gt;boscoh.com&lt;/a&gt;
    &lt;/div&gt;
    &lt;div&gt;
        &lt;a id=&quot;ref-2&quot;&gt;&lt;/a&gt;This is the detail to the linked reference, maybe it's a link&lt;a href=&quot;http://boscoh.com&quot;&gt;boscoh.com&lt;/a&gt;
    &lt;/div&gt;
    &lt;div&gt;
        &lt;a id=&quot;ref-3&quot;&gt;&lt;/a&gt;This is the detail to the linked reference, maybe it's a link&lt;a href=&quot;http://boscoh.com&quot;&gt;boscoh.com&lt;/a&gt;
    &lt;/div&gt;
&lt;/div&gt;
  </pre>
</div>





## Write Article in HTML

Of course, you can just write the html yourself as in (article.html [article.html](#fig-html). The only things you need to do are:

1. include a css in the header `light.css`.

2. include the script at the bottom `supplescroll.compiled.js`

3. (optionally) include the banner as a top level `<div id="banner">`.

4. headers will be incorporated into the table-of-contents.

5. `<div id="fig*"` will be pulled into the figure column.

6. `<a href="fig*">` and `<a href="ref*">` will be cross-referenced.

7. references should be labelel `<a id="ref*"></a>` and put in  figure `<div>`.


<div id='fig-html'> 
  <code>article.html</code> - key ingredients of an HTML article page that works with the lucid theme.
  <pre>
&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;My Article in Window&lt;/title&gt;
  &lt;link href=&quot;light.css&quot; rel=&quot;stylesheet&quot;/&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;div id=&quot;banner&quot;&gt;
        &lt;a href=&quot;http://github.com/boscoh/supplescroll&quot;&gt;
            supplescroll
        &lt;/a&gt; 
        &amp;gt; My Article
    &lt;/div&gt;

    &lt;h1&gt;My Article with Supplescroll&lt;/h1&gt;

    &lt;h2&gt;A sub-heading&lt;/h2&gt;

    This is example code

    &lt;h3&gt;Figure links&lt;/h3&gt;

    &lt;p&gt;I will talk about code 
    &lt;a href=&quot;#fig-code-fragment&quot;&gt;&lt;/a&gt;,
    a photo &lt;a href=&quot;#fig-photo&quot;&gt;&lt;/a&gt;, 
    and a video &lt;a href=&quot;#fig-youtube&quot;&gt;&lt;/a&gt;.

    &lt;h3&gt;Reference links&lt;/h3&gt;
    With some links with references 
    (to &lt;a href=&quot;#ref-1&quot;&gt;this&lt;a&gt;), 
    to (&lt;a href=&quot;#ref-2&quot;&gt;that&lt;a&gt;), 
    and to (&lt;a href=&quot;#ref-3&quot;&gt;this one&lt;a&gt;).


    &lt;div id=&quot;fig-code-fragment&quot;&gt; 
        A Code Fragment 
        &lt;pre&gt;Hello World&lt;/pre&gt;
    &lt;/div&gt;

    &lt;div id=&quot;fig-photo&quot;&gt;
        &lt;img src=&quot;photo.jpg&quot;/&gt;
    &lt;/div&gt;

    &lt;div id=&quot;fig-youtube&quot;&gt;
        Link to youtube&lt;br/&gt;&lt;br/&gt;
        &lt;iframe allowfullscreen=&quot;&quot; frameborder=&quot;0&quot; height=&quot;315&quot; src=&quot;http://www.youtube.com/embed/Fk5reVYChlo?list=FLnRk0rt9QwA9a_mmCvlfXDw&amp;amp;start=52&quot; width=&quot;560&quot;&gt;&lt;/iframe&gt;
    &lt;/div&gt;

    &lt;div id=&quot;fig-references&quot;&gt;
        REFERENCES
        &lt;br&gt;
        &lt;br&gt;
        &lt;div&gt;
            &lt;a id=&quot;ref-1&quot;&gt;&lt;/a&gt;
            &lt;a href=&quot;http://google.com&quot;&gt;http://google.com&lt;/a&gt;
            - a link to this well-known search engine.
        &lt;/div&gt;
        &lt;br&gt;
        &lt;div&gt;
            &lt;a id=&quot;ref-2&quot;&gt;&lt;/a&gt;
            &lt;a href=&quot;http://github.com&quot;&gt;http://github.com&lt;/a&gt;
            - where the source-code is stored.
        &lt;/div&gt;
        &lt;br&gt;
        &lt;div&gt;
            &lt;a id=&quot;ref-3&quot;&gt;&lt;/a&gt;
            &lt;a href=&quot;http://boscoh.com&quot;&gt;http://boscoh.com&lt;/a&gt;
            - the website of the author of this package.
        &lt;/div&gt;
        &lt;br&gt;
    &lt;/div&gt;

&lt;/body&gt;
&lt;script src=&quot;supplescroll.compiled.js&quot; type=&quot;text/javascript&quot;&gt;&lt;/script&gt;&lt;/body&gt;&lt;/html&gt; </pre>
</div>



## Theme it Yourself

If you are familiar with the holy triumvirate of HTML/CSS/javascript, you might want to theme your own templates. Just follow any of the css styles and tweak. At the moment, you'll have to hand-edit your HTML to link in your css.


<div id="fig-references">
    REFERENCES
    <br>
    <br>
    <div>
        <a id="ref-1"></a><a href="http://google.com">http://google.com</a> - a link to this well-known search engine.
    </div>
    <br>
    <div>
        <a id="ref-2"></a><a href="http://github.com">http://github.com</a> - where the source-code is stored.
    </div>
    <br>
    <div>
        <a id="ref-3"></a><a href="http://boscoh.com">http://boscoh.com</a> - the website of the author of this package.
    </div>
    <br>
</div>





## Changelog

- 2.0 (16/11/2015)
    - written in ES6
	- compiled into single js using browserify
	- breadcrumb
    - builds page with javascript
    - references
    - adjustable sliders


