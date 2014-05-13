

import os
import shutil
import glob
import sys

import yaml
from docopt import docopt
import embellish.engine


from _version import *


supplescroll_dir = os.path.join(os.path.dirname(__file__))
themes_dir = os.path.join(supplescroll_dir, 'themes')
themes = glob.glob(os.path.join(themes_dir, '*'))
themes = map(os.path.basename, themes)


def get_theme_haml(theme):
  if theme not in themes:
    raise Excpetion("%s not found in themes %s" % (theme, themes))
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


def make_html(theme, in_markdown, html):
  page = parse_markdown(in_markdown)
  page.update({
    'template': get_theme_haml(theme),
    'include_dir': 'supplescroll.inc',
    'target': html,
  })
  copy_theme_files(theme, page['include_dir'])
  write_page_to_markdown(page, html+'.md')
  site = embellish.engine.default_site.copy()
  site.update({ 'cached_pages':'', 'files':[html+'.md'] })
  embellish.engine.generate_site(site)



