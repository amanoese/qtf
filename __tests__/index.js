const appRoot = `${__dirname}/..`
const qtf_cmd = `${appRoot}/src/index.js`
const tmp = require('tmp');

const fs   = require('fs');
const fsp = require('fs').promises;
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const test_img = '__tests__/lena.jpg'

describe('',()=>{
  beforeAll(async ()=>{
    await exec(`${qtf_cmd} save all`)
  })

  test('help',async ()=>{
    let { stdout } = await exec(`${qtf_cmd} --no-color --help`)
    expect(stdout.toString())
      .toMatch(/qtf \d.\d\.\d/)
  })

  test('blazeface',async ()=>{
    let { stdout } = await exec(`${qtf_cmd} blazeface ${test_img}`)

    expect(() => {
      JSON.parse(stdout.toString())
    }).not.toThrow();
  })

  test('posenet',async ()=>{
    let { stdout } = await exec(`${qtf_cmd} posenet ${test_img}`)

    expect(() => {
      JSON.parse(stdout.toString())
    }).not.toThrow();
  })

  test('body-pix',async ()=>{
    let out_img = tmp.tmpNameSync({ postfix:'.jpg' });

    await expect(fsp.access(out_img)).rejects.toThrow()

    await exec(`${qtf_cmd} body-pix ${test_img} -o ${out_img}`)

    await expect(fsp.access(out_img)).resolves.toBeUndefined()
  })

  test('deeplab',async ()=>{
    let out_img = tmp.tmpNameSync({ postfix:'.jpg' });

    await expect(fsp.access(out_img)).rejects.toThrow()

    await exec(`${qtf_cmd} deeplab ${test_img} -o ${out_img}`)

    await expect(fsp.access(out_img)).resolves.toBeUndefined()
  })
})
