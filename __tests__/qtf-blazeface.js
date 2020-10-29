const util = require('util');
const rewire = require('rewire')
const tempy = require('tempy');

const exec = util.promisify(require('child_process').exec);
const fsp = require('fs').promises;

const { tf_loader } = require('../src/qtf-tfjs-loader');
const qtf_blazeface = require('../src/qtf-blazeface.js')
const _qtf_blazeface = rewire('../src/qtf-blazeface.js')

const test_img = '__tests__/lena.jpg'

beforeAll(async ()=>{
  await tf_loader()
})

describe('blazeface by gcp remote model',()=>{

  beforeAll(async ()=>{
    await exec('bash -c "test -d models/blazeface && rm -r models/blazeface" || :')
  })

  test('load',async ()=>{

    let model = await qtf_blazeface.load_model()

    expect(model)
      .toHaveProperty(
        'blazeFaceModel.modelUrl',
        'https://tfhub.dev/tensorflow/tfjs-model/blazeface/1/default/1/model.json?tfjs-format=file'
      )
  })

  test('save_model',async ()=>{

    await qtf_blazeface.save_model()

    let model = await qtf_blazeface.load_model()

    expect(model)
      .toHaveProperty(
        'blazeFaceModel.modelUrl',
        'file://./models/blazeface/model.json'
      )
  })
})

describe('blazeface by local model',()=>{

  test('run',async ()=>{
    let result = await qtf_blazeface.run('__tests__/lena.jpg')

    expect(result)
      .toHaveProperty('length',1)

    expect(result[0].probability[0])
      .toBeGreaterThanOrEqual(0.99);

    // maybe value of 271.22651290893555
    expect(result[0].landmarks[0][0])
      .toBeGreaterThanOrEqual(265);
    expect(result[0].landmarks[0][0])
      .toBeLessThanOrEqual(275);
  })

  test('out_image',async ()=>{
    let result = await qtf_blazeface.run(test_img)
    let out_img = tempy.file({extension:'jpg'})

    await expect(fsp.access(out_img)).rejects.toThrow()

    await qtf_blazeface.out_image(test_img,out_img,result)

    await expect(fsp.access(out_img)).resolves.toBeUndefined()
  })
})
