

import os
import shutil
import glob
import sys
from htmlentitydefs import codepoint2name

import yaml

from docopt import docopt

import bs4

import embellish.engine


from _version import *


supplescroll_dir = os.path.join(os.path.dirname(__file__))
themes_dir = os.path.join(supplescroll_dir, 'themes')
themes = glob.glob(os.path.join(themes_dir, '*'))
themes = map(os.path.basename, themes)


def get_theme_haml(theme):
  if theme not in themes:
    raise Exception("%s not found in themes %s" % (theme, themes))
  return os.path.join(themes_dir, theme, theme+'.haml')


def parse_markdown(markdown):
  """
  Return page dictionary from markdown with yaml header.
  """
  # split by '---' lines just for 3 parts
  parts = ['']
  for line in open(markdown, 'Ur').read().splitlines():
    if len(parts) < 3:
      if line.startswith('---') and line.strip() == '---':
        parts.append('')
        continue
    parts[-1] += line + '\n'

  page = {}
  if len(parts) > 1:
    page =  yaml.load(parts[0])
  page['summary'] = parts[1] if len(parts) == 2 else ''
  page['text'] = parts[-1]
  return page


def write_page_to_markdown(page, markdown):
  text = page['text']
  summary = page['summary']
  del page['text']
  del page['summary']
  s = yaml.dump(page, default_flow_style=False)
  s += '---\n'
  s += summary
  s += '---\n'
  s += text
  open(markdown, 'w').write(s)


def copy_theme_files(theme, target_dir):
  theme_dir = os.path.join(themes_dir, theme)
  if not os.path.isdir(target_dir):
    os.makedirs(target_dir)
  for f in glob.glob(os.path.join(supplescroll_dir, 'js/*')):
    shutil.copy(f, target_dir)
  for f in glob.glob(os.path.join(supplescroll_dir, 'css/*')):
    shutil.copy(f, target_dir)
  for f in glob.glob(os.path.join(theme_dir, '*')):
    shutil.copy(f, target_dir)


def find_div_id(tag, tag_name, match_id_fn):
  def inner_fn(tag):
    if tag.name != tag_name:
      return False
    if tag.has_attr('id'):
      if match_id_fn(tag.attrs['id']):
        return True
    return False
  return tag.find_all(inner_fn)


def unicode_to_entities(text):
  """
  Identifies unicode characters that can be converted to
  HTML-safe html-entities. Also translates smart single and
  double quotes into normal double and single quotes, and
  turns ellipses into three full-stops.
  """
  new_lines = []
  for line in text.splitlines():
    pieces = []
    for ch in line:
      codepoint = ord(ch)
      if codepoint > 128:
        if codepoint in codepoint2name:
          html = '&' + codepoint2name[codepoint] + ';'
          pieces.append(html)
        else:
          html = '&#{0};'.format(codepoint)
          pieces.append(html)
      else:
        pieces.append(ch)
    new_lines.append(''.join(pieces))
  return "\n".join(new_lines)



def rework_figures(html):
  soup = bs4.BeautifulSoup(open(html))
  fig_labels = {}
  fig_fn = lambda i: i.startswith('fig') and not i.startswith('figure-list')
  for i_fig, fig_div in enumerate(find_div_id(soup, 'div', fig_fn)):
    fig_id = fig_div.attrs['id']
    fig_href = '#' + fig_id
    fig_label = 'Figure %d' % (i_fig+1)
    fig_labels[fig_href] = fig_label
    fig_div.insert(0, fig_label + '. ')
  for link in soup.find_all('a'):
    if 'href' in link.attrs:
      href = link.attrs['href']
      if href in fig_labels:
        link.string = fig_labels[href]
  open(html, 'w').write(unicode_to_entities(unicode(soup)))


def make_html(theme, in_markdown, html):
  page = {
    'template': get_theme_haml(theme),
    'include_dir': 'supplescroll.inc',
    'target': html,
    'breadrumb': '',
    'postpend': '',
  }
  page.update(parse_markdown(in_markdown))
  copy_theme_files(theme, page['include_dir'])
  write_page_to_markdown(page, html+'.md')
  site = embellish.engine.default_site.copy()
  site.update({ 'cached_pages':'', 'files':[html+'.md'] })
  embellish.engine.generate_site(site)
  rework_figures(html)



