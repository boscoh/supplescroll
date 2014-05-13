
__doc__ = """
Prepare supplescroll directory for github gh-pages.

Usage: sample_themes.py [-c]

 -c   clean-up HTML files
"""

import os
from docopt import docopt
import supplescroll

args = docopt(__doc__)

if args['-c']:
  os.system('rm -rf supplescroll.inc *html*')
else:
  for html, theme in [
      ('index.html', 'dark'),
      ('sample2.html', 'light'),
      ('sample3.html', 'lucid'),
      ('sample4.html', 'yeolde'),
      ('sample5.html', 'clown'),
      ('sample6.html', 'sphinx'),
    ]:
    print html
    supplescroll.make_html(theme, 'readme.md', html)
