const util = require('util');
const rewire = require('rewire')
const tempy = require('tempy');

const exec = util.promisify(require('child_process').exec);
const fsp = require('fs').promises;

const qtf_mobilenet = require('../src/qtf-mobilenet.js')
const _qtf_mobilenet = rewire('../src/qtf-mobilenet.js')

const test_img = '__tests__/lena.jpg'

describe('mobilenet by gcp remote model',()=>{
  beforeAll(async ()=>{
    await exec('bash -c "test -d models/mobilenet && rm -r models/mobilenet || :"')
  })

  test('load',async ()=>{

    let model = await _qtf_mobilenet.__get__('load_model')()

    expect(model)
      .toHaveProperty(
        'model.modelUrl',
        'https://tfhub.dev/google/imagenet/mobilenet_v1_100_224/classification/1/model.json?tfjs-format=file'
      )
  })

  test('save_model',async ()=>{

    await qtf_mobilenet.save_model()

    let model = await _qtf_mobilenet.__get__('load_model')()

    expect(model)
      .toHaveProperty(
        'model.modelUrl',
        'file://./models/mobilenet/model.json'
      )
  })
})

describe('blazeface by local model',()=>{
  test.concurrent('run',async ()=>{
    let result = await qtf_mobilenet.run('__tests__/lena.jpg')
    expect(result).toHaveProperty('length',3)
  })
})
