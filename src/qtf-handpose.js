const fs = require('fs');
const fsp = require('fs').promises;
const tf = require('@tensorflow/tfjs-node');
//const tf = require('@tensorflow/tfjs-node-gpu');
const handpose = require('@tensorflow-models/handpose');
const PImage = require('pureimage');
const { img_to_t3d } = require('./utils.js');

let load_model = async (loadOption = {}) => {
  return await handpose.load({
		detectionConfidence: 0.2,
  });
}

async function run (imagePath,loadOption) {
  // pimg isBitmap { width, height, data: Buffer
  let pimg = await PImage.decodeJPEGFromStream(
    fs.createReadStream(imagePath)
	);

  // TODO: Buffer to Uint8Array
  const imgFile = await fsp.readFile(imagePath);
  const img_u8a = new Uint8Array(imgFile);

  let model = await load_model()

	//estimatHands support tf.Tensor.but it is on brawser ?
  //const predictions = await model.estimateHands(img_Tensor3D);
  const predictions = await model.estimateHands({
		...pimg,
		data: img_u8a
	})

  return predictions
}
module.exports = {
  run,
}
