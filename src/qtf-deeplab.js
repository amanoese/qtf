const fs = require('fs');
const fsp = require('fs').promises;
const tf = require('@tensorflow/tfjs-node');
//const tf = require('@tensorflow/tfjs-node-gpu');
const PImage = require('pureimage');
const { img_to_t3d } = require('./utils.js');

const deeplab = require('@tensorflow-models/deeplab');

let load_model = async (LoadOption = {}) => {
  return await deeplab.load()
}

async function run (imagePath,LoadOption) {
  const [ model, img_Tensor3D ] = await Promise.all([
    await load_model(),
    await img_to_t3d(imagePath)
  ]);

  const colormap = deeplab.getColormap(model.base);
  const labels   = deeplab.getLabels(model.base);
  console.log({colormap,labels});
  const predictions = await model.predict(img_Tensor3D);
  return predictions;
}

module.exports = {
  run,
}

