#!/usr/bin/env python
from setuptools import setup

version = open('supplescroll/_version.py').read().split()[-1][1:-1]

setup(
    name='supplescroll',
    version=version,
    author='Bosco Ho',
    author_email='boscoh@gmail.com',
    url='http://boscoh.github.io/supplescroll',
    description='converts markdown to HTML with integrated table '
                ' of contents and figure panel, tied together '
                'with some supple scrolling',
    long_description='Docs at http://boscoh.github.io/supplescroll',
    license='BSD',
    install_requires=[
        'PyYaml',
        'docopt',
        'markdown',
        'jinja2',
        'beautifulsoup4',
        'html5lib'
    ],
    packages=['supplescroll',],
    include_package_data=True,
    scripts=['python_bin/supplescroll'],
)