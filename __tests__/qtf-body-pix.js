const util = require('util');
const rewire = require('rewire')
const tempy = require('tempy');

const exec = util.promisify(require('child_process').exec);
const fsp = require('fs').promises;

const { tf_loader } = require('../src/qtf-tfjs-loader');
const qtf_bodyPix = require('../src/qtf-body-pix.js')
const _qtf_bodyPix = rewire('../src/qtf-body-pix.js')

const test_img = '__tests__/lena.jpg'

beforeAll(async ()=>{
  await tf_loader()
})

describe('bod-pix by gcp remote model',()=>{

  beforeAll(async ()=>{
    await exec('bash -c "test -d models/body-pix && rm -r models/body-pix" || :')
  })

  test('load',async ()=>{

    let model = await qtf_bodyPix.load_model()

    expect(model)
      .toHaveProperty(
        'baseModel.model.modelUrl',
        'https://storage.googleapis.com/tfjs-models/savedmodel/bodypix/mobilenet/float/100/model-stride16.json'
      )
  })

  test('save_model',async ()=>{

    await qtf_bodyPix.save_model()

    let model = await qtf_bodyPix.load_model()

    expect(model)
      .toHaveProperty(
        'baseModel.model.modelUrl',
        'file://./models/body-pix/model.json'
      )
  })
})

describe('body-pix by local model',()=>{

  test('run',async ()=>{
    let result = await qtf_bodyPix.run(test_img)

    let data = Array.from(result.data)
    //pixel value 0:130541
    //pixel value 1:131603
    expect(data.filter(v=>v).length)
      .toEqual(131603)
  })

  test('out_image',async ()=>{
    let result = await qtf_bodyPix.run(test_img)
    let out_img = tempy.file({extension:'jpg'})

    await expect(fsp.access(out_img)).rejects.toThrow()

    await qtf_bodyPix.out_image(test_img,out_img,result)

    await expect(fsp.access(out_img)).resolves.toBeUndefined()
  })
})
