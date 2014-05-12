import supplescroll
pairs = [
  ('index.html', 'dark'),
  ('sample2.html', 'light'),
  ('sample3.html', 'lucid'),
  ('sample4.html', 'yeolde'),
  ('sample5.html', 'clown'),
  ('sample6.html', 'sphinx'),
]
for html, theme in pairs:
  print html
  supplescroll.make_html(theme, 'readme.md', html)
