./browserify.sh
if [ -f supplescroll.min.js ] 
    then
        rm supplescroll.min.js
fi
uglifyjs --compress --mangle -- supplescroll.compiled.js > supplescroll.min.js
cp supplescroll.min.js ../..
sassin dark.sass dark.css
sassin light.sass light.css
sassin clown.sass clown.css
sassin yeolde.sass yeolde.css
sassin sphinx.sass sphinx.css