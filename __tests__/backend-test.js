const appRoot = `${__dirname}/..`
const qtf_cmd = `${appRoot}/src/index.js`
const tempy = require('tempy');

const fs   = require('fs');
const fsp = require('fs').promises;
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const test_img = '__tests__/lena.jpg'

describe('',()=>{
  beforeAll(async ()=>{
    await exec(`${qtf_cmd} save blazeface`)
  })

  test('default backend',async ()=>{
    let { stdout } = await exec(`${qtf_cmd} backend`)

    expect( stdout.toString() ).toMatch('now      : tensorflow')
  })

  test('tensorflow backend',async ()=>{
    let { stdout } = await exec(`QTF_BACKEND=tensorflow ${qtf_cmd} blazeface ${test_img}`)

    expect(() => {
      JSON.parse(stdout.toString())
    }).not.toThrow();
  })

  test('cpu backend',async ()=>{
    let { stdout } = await exec(`QTF_BACKEND=cpu ${qtf_cmd} blazeface ${test_img}`)

    expect(() => {
      JSON.parse(stdout.toString())
    }).not.toThrow();
  })

  test('wasm backend',async ()=>{
    let { stdout } = await exec(`QTF_BACKEND=wasm ${qtf_cmd} blazeface ${test_img}`)

    expect(() => {
      JSON.parse(stdout.toString())
    }).not.toThrow();
  })

})
