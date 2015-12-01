title: supplescroll documentation
banner: supplescroll documentation
is_rename: True
---





# SUPPLESCROLL

_scrolling articles to your heart's delight_

> Supplescroll is a javascript plugin that converts a plain HTML document into an interactive document with auto-generated table-of-contents and easy-to-read figures and references.

It turns this [markdown](https://github.com/boscoh/supplescroll/blob/master/readme.md) into this [interactive webpage](http://boscoh.github.com/supplescroll).

Features:

- auto-generated table of contents 
- independent figure list
- handy URL hashes
- back links to references 
- context-aware auto-scrolling  
- movable dividers 
- iOS-aware/responsive themes

Available themes:

  - `dark` ([index.html](index.html))
  - `light` ([light.html](light.html))
  - `yeolde` ([yeolde.html](yeolde.html))
  - `clown` ([clown.html](clown.html))
  - `sphinx` ([sphinx.html](sphinx.html))




## Usage

Once the `article.md` [article.md](#fig-markdown) is written, then:

    > supplescroll article.md 

Which makes `article.html`. Open it. 

To choose another theme with your choice of output:

    > supplescroll -o colorful.html article.md clown

If you have a plain HTML file (article.html [article.html](#fig-html), you can add the supplescroll widget:

    > supplescroll article.html

Which will overwrite `article.html` and copy the required files over.




## Installation

_Python_. You should:

    > pip install supplescroll

Or you could download from [github](https://github.com/boscoh/supplescroll/archive/master.zip) and:

    > python setup.py install

_Node_. Then you should:

    > npm install supplescroll

You can browse the code at

&nbsp;&nbsp;&nbsp; <http://github.com/boscoh/supplescroll>

Please fork and pull-request. New themes welcome!





## Write Article with Markdown

`supplescroll` uses a typical YAML/markdown format to convert your documents into HTML. An example is in [article.md](#fig-markdown):

<div id="fig-markdown"> 
	<code>article.md</code> - example of an article in supplescroll
	<pre>

title: My Article in Window Title
banner: My Article Heading in Page
is_rename: False
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

The `is_rename` boolean indicates whether links to references and figures are to be renamed.


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

8. (optionally) to suppress figure/reference naming add `<script> window.is_rename = false </script>`


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

If you are familiar with CSS then you can change substitute your own CSS file. Just open one of the existing ones, and restyle it the way you want.


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




## Change Log

- 2.1 (30/11/2015)
    - node version

- 2.0 (16/11/2015)
    - switched to ES6
    - compiled into single js file
    - breadcrumb
    - builds columns in page dynamically
    - references
    - adjustable sliders for columns


