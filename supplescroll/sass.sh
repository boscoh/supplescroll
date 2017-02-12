#!/usr/bin/env bash
# Please install sass first: http://sass-lang.com/install
sass clown.sass clown.css
sass light.sass light.css
sass dark.sass dark.css
sass sphinx.sass sphinx.css
sass yeolde.sass yeolde.css
rm *.css.map
