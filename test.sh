echo '-----------------------------'
echo 'BUILD'
echo '-----------------------------'
npm run build
rm -r models/*

echo '-----------------------------'
echo 'TEST rollup ## remote model'
echo '-----------------------------'
time node ./src/index.js posenet ./__tests__/lena.jpg > /dev/null

echo '-----------------------------'
echo 'TEST ## save model'
echo '-----------------------------'
node ./src/index.js save all

echo '-----------------------------'
echo 'TEST rollup ## src/'
echo '-----------------------------'
time node ./src/index.js  posenet ./__tests__/lena.jpg > /dev/null

echo '-----------------------------'
echo 'TEST rollup ## dist/'
echo '-----------------------------'
time node ./dist/index.js posenet ./__tests__/lena.jpg > /dev/null

