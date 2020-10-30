const path = require('path')
let qtf_cmd = `${__dirname}/src/index.js`;
if (process.platform === 'win32') {
  qtf_cmd = `node ${__dirname}\\src\\index.js`;
}
const tempy = require('tempy');

const fs   = require('fs');
const fsp = require('fs').promises;
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const test_img = '__tests__/lena.jpg'

describe('backend test',()=>{
  beforeAll(async ()=>{
    //await exec(`${qtf_cmd} save blazeface`)
  })

  test('default backend',async ()=>{
    let { stdout } = await exec(`${qtf_cmd} backend`)

    expect( stdout.toString() ).toMatch('now      : tensorflow')
  })

  test('tensorflow backend',async ()=>{
    let env = { ...process.env, 'QTF_BACKEND':'tensorflow' }
    let { stdout } = await exec(`${qtf_cmd} blazeface ${test_img}`,{ env });

    expect(() => {
      JSON.parse(stdout.toString())
    }).not.toThrow();
  })

  test('cpu backend',async ()=>{
    let env = { ...process.env, 'QTF_BACKEND':'cpu' }
    let { stdout } = await exec(`${qtf_cmd} blazeface ${test_img}`,{ env });

    expect(() => {
      JSON.parse(stdout.toString())
    }).not.toThrow();
  })

  test('wasm backend',async ()=>{
    let env = { ...process.env, 'QTF_BACKEND':'wasm' }
    let { stdout } = await exec(`${qtf_cmd} blazeface ${test_img}`,{ env });

    expect(() => {
      JSON.parse(stdout.toString())
    }).not.toThrow();
  })

})
