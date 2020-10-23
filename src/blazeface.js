const fs = require('fs');
const fsp = require('fs').promises;
const tf = require('@tensorflow/tfjs-node');
//const tf = require('@tensorflow/tfjs-node-gpu');
const blazeface = require('@tensorflow-models/blazeface');
const { img_to_t3d } = require('./utils');

let load_model = async (LoadOption = {}) => {
  let err = await fsp.access('./models/blazeface/model.json')
  if(!err) {
    // '@tensorflow-models/blazeface' is not support modelurl option.
    // https://github.com/tensorflow/tfjs-models/pull/534
    // https://github.com/tensorflow/tfjs-models/blob/master/blazeface/src/index.ts#L36-L50


    let option = {
      maxFaces = 10,
      inputWidth = 128,
      inputHeight = 128,
      iouThreshold = 0.3,
      scoreThreshold = 0.75
    } = { ...LoadOption }

    console.warn('[QTF] Using local model');
    let tfmodel = await tf.loadGraphModel('file://./models/blazeface/model.json');
    return new blazeface.BlazeFaceModel(
      tfmodel,
      inputWidth, inputHeight, maxFaces, iouThreshold, scoreThreshold
    );
  }
  return await blazeface.load(LoadOption);
}

async function run(imagePath) {
  let model = await load_model()
  let img_Tensor3D = await img_to_t3d(imagePath)

  const predictions = await model.estimateFaces(img_Tensor3D);
  return predictions
}
async function save_model () {
  //TODO: Not enough because posenet is multiple models.
  const model = await blazeface.load();
  await model.blazeFaceModel.save('file://./models/blazeface')
  console.log('save posenet!')
}

module.exports = {
  run,
  save_model,
}

