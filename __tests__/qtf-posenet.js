const util = require('util');
const rewire = require('rewire')
const tempy = require('tempy');

const exec = util.promisify(require('child_process').exec);
const fsp = require('fs').promises;

const qtf_posenet = require('../src/qtf-posenet.js')
const _qtf_posenet = rewire('../src/qtf-posenet.js')

const test_img = '__tests__/lena.jpg'

describe('posenet by gcp remote model',()=>{
  beforeAll(async ()=>{
    await exec('rm -r models/')
    await exec('mkdir models/')
    await exec('touch models/.gitkeep')
  })

  test('load',async ()=>{

    let model = await _qtf_posenet.__get__('load_model')()

    expect(model)
      .toHaveProperty(
        'baseModel.model.modelUrl',
        'https://storage.googleapis.com/tfjs-models/savedmodel/posenet/mobilenet/float/100/model-stride16.json'
      )
  })

  test('save_model',async ()=>{

    await qtf_posenet.save_model()

    let model = await _qtf_posenet.__get__('load_model')()

    expect(model)
      .toHaveProperty(
        'baseModel.model.modelUrl',
        'file://./models/posenet/model.json'
      )
  })
})

describe('posenet by local model',()=>{

  test.concurrent('run',async ()=>{
    let result = await qtf_posenet.run('__tests__/lena.jpg')

    expect(result)
      .toHaveProperty('keypoints.0.part','nose')

    // maybe value of x is 305.82982733463035
    // othertime 310.44099586575874,
    expect(result.keypoints[0].position.x)
      .toBeGreaterThanOrEqual(300);
    expect(result.keypoints[0].position.x)
      .toBeLessThanOrEqual(315);

    //  maybe value of score is 0.9134889245033264,
    expect(result.keypoints[0].score)
      .toBeGreaterThanOrEqual(0.9);
  })

  test.concurrent('out_image',async ()=>{
    let result = await qtf_posenet.run(test_img)
    let out_img = tempy.file({extension:'jpg'})

    await expect(fsp.access(out_img)).rejects.toThrow()

    await qtf_posenet.out_image(test_img,out_img,result)

    await expect(fsp.access(out_img)).resolves.toBeUndefined()
  })
})
