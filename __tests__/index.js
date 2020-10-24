const appRoot = `${__dirname}/..`
const qtf_cmd = `${appRoot}/src/index.js`

const fs   = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

describe('',()=>{
  test('help',async ()=>{
    let { stdout } = await exec(`${qtf_cmd} --help`)
    expect(stdout).toEqual(
      expect.stringContaining('▸ qtf <command> [ARGUMENTS...] [OPTIONS...]')
    );
  })
})
