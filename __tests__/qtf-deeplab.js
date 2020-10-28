const util = require('util');
const rewire = require('rewire')
const tempy = require('tempy');

const exec = util.promisify(require('child_process').exec);
const fsp = require('fs').promises;

const qtf_deeplab = require('../src/qtf-deeplab.js')
const _qtf_deeplab = rewire('../src/qtf-deeplab.js')

const test_img = '__tests__/lena.jpg'

describe('bod-pix by gcp remote model',()=>{

  beforeAll(async ()=>{
    await exec('bash -c "test -d models/deeplab && rm -r models/deeplab" || :')
  })

  test('load',async ()=>{

    let model = await _qtf_deeplab.__get__('load_model')()

    expect(model)
      .toHaveProperty(
        'model.modelUrl',
        'https://tfhub.dev/tensorflow/tfjs-model/deeplab/pascal/1/quantized/2/1/model.json?tfjs-format=file'
      )
  })

  test('save_model',async ()=>{

    await qtf_deeplab.save_model()

    let model = await _qtf_deeplab.__get__('load_model')()

    expect(model)
      .toHaveProperty(
        'model.modelUrl',
        'file://./models/deeplab/model.json'
      )
  })
})

describe('deeplab by local model',()=>{
  test('run',async ()=>{
    let result = await qtf_deeplab.run('__tests__/lena.jpg')

    expect(Object.keys(result.legend))
      .toEqual([ 'background', 'person', 'potted plant' ])
  })
  test('out_image',async ()=>{
    let result = await qtf_deeplab.run(test_img)
    let out_img = tempy.file({extension:'jpg'})

    await expect(fsp.access(out_img)).rejects.toThrow()

    await qtf_deeplab.out_image(test_img,out_img,result)

    await expect(fsp.access(out_img)).resolves.toBeUndefined()
  })
})
