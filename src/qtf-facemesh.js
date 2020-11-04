const fs = require('fs');
const fsp = require('fs').promises;
const PImage = require('pureimage');
const { img_to_t3d } = require('./utils.js');

const faceLandmarksDetection = require('@tensorflow-models/face-landmarks-detection');

let load_model = async (LoadOption = {}) => {
  const model = await faceLandmarksDetection.load()
  return model
}
async function run (imagePath,LoadOption) {
  const [ model, img_Tensor3D ] = await Promise.all([
    await load_model(),
    await img_to_t3d(imagePath)
  ]);

  const predictions = await model.estimateFaces({
    input: img_Tensor3D
  });
  return predictions;
}

module.exports = {
  load_model,
  run,
}

