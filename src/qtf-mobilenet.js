const fs = require('fs');
const fsp = require('fs').promises;
const PImage = require('pureimage');
const { img_to_t3d } = require('./utils.js');

const mobilenet = require('@tensorflow-models/mobilenet');

let load_model = async (LoadOption = {}) => {
  try {
    await fsp.access('./models/mobilenet/model.json')
    console.warn('[QTF] Using local model');

    return await mobilenet.load({
      version: 1,
      alpha: 1.0,
      modelUrl:'file://./models/mobilenet/model.json',
      ...LoadOption
    });
  } catch (err) {
    return await mobilenet.load();
  }
}

async function run (imagePath,LoadOption) {
  const [ model, img_Tensor3D ] = await Promise.all([
    await load_model(),
    await img_to_t3d(imagePath)
  ]);

  const predictions = await model.classify(img_Tensor3D);
  return predictions;
}

async function save_model () {
  //TODO: Not enough because posenet is multiple models.
  let model = await mobilenet.load()
  await model.model.save('file://./models/mobilenet')
  console.log('save mobilenet!')
}

module.exports = {
  load_model,
  run,
  save_model,
}

