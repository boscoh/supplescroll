./browserify.sh
if [ -f supplescroll.min.js ] 
    then
        rm supplescroll.min.js
fi
uglifyjs --compress --mangle -- supplescroll.compiled.js > supplescroll.min.js
cp supplescroll.min.js ../..