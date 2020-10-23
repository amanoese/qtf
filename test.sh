##./src/index.js posenet ./test_img/oliva.jpg -o out.jpg
echo    '-----------------------------'
echo    'BUILD'
echo    '-----------------------------'
npm run build
echo    '-----------------------------'
echo    'TEST rollup ## src/'
echo -n '-----------------------------'
time node ./src/index.js  posenet ./test_img/oliva.jpg -l '{"modelUrl":"file://./pose-model/model.json"}' 2>/dev/null
echo    '-----------------------------'
echo    'TEST rollup ## dist/'
echo -n '-----------------------------'
time node ./dist/index.js posenet ./test_img/oliva.jpg -l '{"modelUrl":"file://./pose-model/model.json"}' 2>/dev/null

echo    '-----------------------------'
echo    'TEST rollup ## remote model'
echo -n '-----------------------------'
time node ./src/index.js  posenet ./test_img/oliva.jpg 2>/dev/null
