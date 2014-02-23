pairs = [
  ('sample2.md', 'light.haml'),
  ('sample3.md', 'lucid.haml'),
  ('sample4.md', 'yeolde.haml'),
  ('sample5.md', 'clown.haml'),
]

for out_md, template in pairs:
  out_f = open(out_md, 'w')
  txt = open('readme.md').read()
  for line in txt.splitlines():
    if line.startswith('template:'):
      out_f.write('template: {}\n'.format(template))
    elif line.startswith('target:'):
      continue
    else:
      out_f.write(line+'\n')
  out_f.close()