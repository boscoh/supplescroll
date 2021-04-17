---
title: supplescroll documentation
banner: supplescroll documentation
is_rename: True
---





# SUPPLESCROLL

_scrolling articles to your heart's delight_

> Supplescroll is a javascript plugin that converts a plain HTML document into an interactive document with auto-generated table-of-contents and easy-to-read figures and references.

It turns this [markdown](https://raw.githubusercontent.com/boscoh/supplescroll/gh-pages/index.md) into this [interactive webpage](http://boscoh.github.com/supplescroll).

Features:

- auto-generated table of contents 
- independent figure list
- handy URL hashes
- back links to references 
- context-aware auto-scrolling  
- movable dividers 
- iOS-aware/responsive themes

Available themes:

  - `dark` ([dark.html](dark.html))
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

With a plain HTML file `article.html` [article.html](#fig-html):

    > supplescroll article.html

Which will overwrite `article.html` and copy the required files over to that directory.


<div id="fig-markdown"> 
  <code>article.md</code> - example of an article in supplescroll

```
---
TITLE: MY ARTICLE IN WINDOW TITLE
BANNER: MY ARTICLE HEADING IN PAGE
IS_RENAME: FALSE
---

THIS IS MY ARTICLE IN MARKDOWN

I will talk about the following things


CODE FRAGMENT

A code fragment 
<div id="fig-code-fragment"> A Code Fragment
<pre>Hello World</pre>
</div>


A PHOTO

a photo 
<div id='fig-photo'>
<img src='http://boscoh.github.io/supplescroll/photo.jpg'>
</div>


A VIDEO

a video 
<div id='fig-youtube'>
Link to youtube
<br><br>
<iframe width="560" height="315" src="http://www.youtube.com/embed/Fk5reVYChlo?list=FLnRk0rt9QwA9a_mmCvlfXDw&start=52" frameborder="0" allowfullscreen></iframe>
</div>
```

</div>


<div id='fig-html'> 
  <code>article.html</code> - ingredients of an HTML page that talks to supplescroll.

```
<html>
<head>
  <title>My Article in Window</title>
</head>
<body>
  <div id="banner">
      <a href="http://github.com/boscoh/supplescroll">
          supplescroll
      </a> 
      &gt; My Article
  </div>
<h1>My Article with Supplescroll</h1>


<h2>A sub-heading</h2>

This is example code

<h3>Figure links</h3>

<p>I will talk about code
<a href="#fig-code-fragment"></a>,
a photo <a href="#fig-photo"></a>,
and a video <a href="#fig-youtube"></a>.

<h3>Reference links</h3>

With some links with references
(to <a href="#ref-1">this<a>),
to (<a href="#ref-2">that<a>),
and to (<a href="#ref-3">this one<a>).

<div id="fig-code-fragment">
  A Code Fragment
  <pre>Hello World</pre>
</div>

<div id="fig-photo">
  <img src="http://boscoh.github.io/supplescroll/photo.jpg"/>
</div>

<div id="fig-youtube">
  Link to youtube<br/><br/>
  <iframe 
    allowfullscreen="" 
    frameborder="0" 
    height="315" 
    src="http://www.youtube.com/embed/Fk5reVYChlo?list=FLnRk0rt9QwA9a_mmCvlfXDw&start=52"
    width="560">
  </iframe>
  </div>


<div id="fig-references">
  REFERENCES
  <br>
  <br>
  <div>
    <a id="ref-1"></a>
    <a href="http://google.com">http://google.com</a>
    - a link to this well-known search engine.
  </div>
  <br>
  <div>
    <a id="ref-2"></a>
    <a href="http://github.com">http://github.com</a>
    - where the source-code is stored.
  </div>
  <br>
  <div>
    <a id="ref-3"></a>
    <a href="http://boscoh.com">http://boscoh.com</a>
    - the website of the author of this package.
  </div>
  <br>
</div>

</body>
</html>
```

</div>


## Installation

You should:

    > npm install -g supplescroll

You can browse the code at

&nbsp;&nbsp;&nbsp; <http://github.com/boscoh/supplescroll>

Pull-request new themes please.





## Write Article with Markdown

`supplescroll` uses a typical YAML/markdown format to convert your documents into HTML. An example is in [article.md](#fig-markdown):

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
      <img src='./photo.jpg'>
    </div>

which gives [Photo Insert](#fig-photo). 

<div id='fig-photo'> 
  Photo Insert <br>
  <img src='./photo.jpg'>
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


### Automatic Figure Naming

By default, `supplescroll` will assign a label to all figures `(Figure 1)` etc. and references `[1]` etc. To turn this off, set `is_rename: false` field in the header ([example](#fig-markdown)). And make sure you fill in your preferred text.




### References

References are similar to figures, in that you can push references into the third column, and back-links are generated. As such you list all your references in a `<div>` for a figure, which is illustrated with this code snippet [](#fig-reference-code). 

Note the references are `<a id="ref*"></a>` tags that are wrapped by a `<div>`. This allows the correct placement of the reference back-link at the beginning of the `<div>`.

In the main text, links to a reference are written:

    Thus some text can be liberally sprinkled with a reference to:
    
    - google [](#ref-1)
    - github [](#ref-2)
    - boscoh [](#ref-3)

Thus some text can be liberally sprinkled with a reference to:

- google [](#ref-1)
- github [](#ref-2)
- boscoh [](#ref-3)


<div id="fig-reference-code"> 
  example code for references
  <pre>
&lt;div id=&quot;fig-references&quot;&gt;
    &lt;h1&gt;References&lt;/h1&gt;
    &lt;div class="reference"&gt;
        &lt;a id=&quot;ref-1&quot;&gt;&lt;/a&gt;This is the detail to the linked reference, maybe it's a link&lt;a href=&quot;http://boscoh.com&quot;&gt;boscoh.com&lt;/a&gt;
    &lt;/div&gt;
    &lt;div class="reference"&gt;
        &lt;a id=&quot;ref-2&quot;&gt;&lt;/a&gt;This is the detail to the linked reference, maybe it's a link&lt;a href=&quot;http://boscoh.com&quot;&gt;boscoh.com&lt;/a&gt;
    &lt;/div&gt;
    &lt;div class="reference"&gt;
        &lt;a id=&quot;ref-3&quot;&gt;&lt;/a&gt;This is the detail to the linked reference, maybe it's a link&lt;a href=&quot;http://boscoh.com&quot;&gt;boscoh.com&lt;/a&gt;
    &lt;/div&gt;
&lt;/div&gt;
  </pre>
</div>


<div id="fig-references">
    REFERENCES
    <br>
    <br>
    <div class="reference">
        <a id="ref-1"></a><a href="http://google.com">http://google.com</a> - a link to this well-known search engine.
    </div>
    <div class="reference">
        <a id="ref-2"></a><a href="http://github.com">http://github.com</a> - where the source-code is stored.
    </div>
    <div class="reference">
        <a id="ref-3"></a><a href="http://boscoh.com">http://boscoh.com</a> - the website of the author of this package.
    </div>
</div>



## Write Article in HTML

Of course, you can just write the html yourself as in `article.html` [article.html](#fig-html), and then run:

    > supplescroll article.html light

which will insert references to the files:

- `supplescroll.css` - basic styles for the page layout
- `light.css` - specific stylings
- `supplescroll.min.js` - the javascript module that transforms the page

To ensure `supplescroll` processes the correct items, in your HTML file, you should:

1. (optionally) include the banner through a top level `<div id="banner">`.

2. use `<h*>` tags for headers, which will all be incorporated into the table-of-contents.

3. name figures with `<div id="fig*">`.

4. name links to figures as `<a href="fig*">` and name links to references as `<a href="ref*">`.

5. create a figure just to hold references `<div id="fig-references">`

7. put references in the `fig-references` as 

        <div>
          <a id="ref-1"></a> My reference 
        </div>

8. (optionally) suppress figure/reference renmaing naming by adding 

        <script> window.is_rename = false </script>


## Theme it Yourself

If you are familiar with CSS then you can simply change the CSS in any of the themes, and rename the CSS, ensuring the link in the HTML file is also changed. Then send me the CSS!



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

