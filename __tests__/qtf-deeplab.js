const util = require('util');
const rewire = require('rewire')
const tempy = require('tempy');

const exec = util.promisify(require('child_process').exec);
const fsp = require('fs').promises;

const qtf_deeplab = require('../src/qtf-deeplab.js')
const _qtf_deeplab = rewire('../src/qtf-deeplab.js')

const test_img = '__tests__/lena.jpg'


describe('deeplab by local model',()=>{
  test('run',async ()=>{
    let result = await qtf_deeplab.run('__tests__/lena.jpg')
    console.log(result)
  })
})
