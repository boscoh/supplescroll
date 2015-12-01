import os
import shutil
from htmlentitydefs import codepoint2name

from markdown import markdown
import bs4
import yaml
from jinja2 import Environment, DictLoader

from _version import *


def split_by_divider(markdown):
  "split by '---' lines just for 2 parts"
  parts = ['']
  for line in open(markdown, 'Ur').read().splitlines():
    if len(parts) < 2:
      if line.startswith('---') and line.strip() == '---':
        parts.append('')
        continue
    parts[-1] += line + '\n'
  return parts


def convert_unicode_to_html(line):
  "Converts unicode characters into html entities"
  new_line = ""
  for c in line:
    codepoint = ord(c)
    if codepoint > 128:
      if codepoint in codepoint2name:
        new_line += '&{};'.format(codepoint2name[codepoint])
      else:
        new_line += '&#{0};'.format(codepoint)
    else:
      new_line += c
  return new_line


def insert_includes_to_html(theme, html):
  soup = bs4.BeautifulSoup(open(html, 'Ur'), 'html5lib')

  result = soup.find('link', attrs={'href':'supplescroll.css'})
  if not result:
    tag = soup.new_tag('link')
    tag['href'] = 'supplescroll.css'
    tag['rel'] = 'stylesheet'
    tag['type'] = 'text/css'
    soup.head.append(tag)

  theme_css = theme + '.css'
  result = soup.find('link', attrs={'href':theme_css})
  if not result:
    tag = soup.new_tag('link')
    tag['href'] = theme_css
    tag['rel'] = 'stylesheet'
    tag['type'] = 'text/css'
    soup.head.append(tag)

  supplescroll_js = 'supplescroll.min.js'
  result = soup.find('script', attrs={'src': supplescroll_js})
  if not result:
    tag = soup.new_tag('script')
    tag['src'] = supplescroll_js
    tag['type'] = 'text/javascript'
    soup.body.append(tag)

  lines = unicode(soup).splitlines()
  new_lines = map(convert_unicode_to_html, lines)
  open(html, 'w').write("\n".join(new_lines))

  src_dir = os.path.dirname(__file__)
  out_dir = os.path.abspath(os.path.dirname(html))
  for f in [theme + '.css', 'supplescroll.css', supplescroll_js]:
    shutil.copy(os.path.join(src_dir, f), out_dir)


def make_html(theme, in_markdown, html):
  parts = split_by_divider(in_markdown)
  page = {
    'template': 'page.haml',
    'target': html,
    'banner': '',
    'is_rename': True,
    'title': '',
    'content': markdown(
        parts[-1], 
        extensions=['codehilite(guess_lang=False)'])
  }
  if len(parts) > 1:
    page.update(yaml.load(parts[0]))

  page_jinja2 = """\
  <html>
  <head>
  <meta content="initial-scale=1.0" name="viewport"/>
  <title>{{ page.title }}</title>
  {% if not page.is_rename: %}
    <script> window.is_rename = false </script>
  {% endif %}
  </head>
  <body>
    <div id="banner">{{ page.banner }}</div>
    {{ page.content }}
  </body>
  </html>
  """
  jinja2_env = Environment(
    loader=DictLoader({ 'index.html': page_jinja2 }))
  template = jinja2_env.get_template('index.html')

  open(html, 'w').write(template.render({ 'page': page }))

  insert_includes_to_html(theme, html)



