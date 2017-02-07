npm install
if [ -f supplescroll.min.js ] 
    then
        rm supplescroll.min.js
fi
webpack
cp supplescroll.min.js ../..
./sass.sh
