const util = require('util');
const rewire = require('rewire')
const tempy = require('tempy');

const exec = util.promisify(require('child_process').exec);
const fsp = require('fs').promises;

const handpose = require('../src/qtf-handpose.js')
const _handpose = rewire('../src/qtf-handpose.js')

const test_img = '__tests__/lena.jpg'


describe('body-pix by local model',()=>{

  test('run',async ()=>{
    let result = await handpose.run(test_img)
  })

})
