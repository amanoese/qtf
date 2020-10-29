const fs = require('fs');
//const fsp = require('fs').promises;
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-core');
const PImage = require('pureimage');

const img_to_t3d = async (imagePath) => {
  //const imgFile = await fsp.readFile(imagePath);
  //const img_u8a = new Uint8Array(imgFile);
  //const img_Tensor3D = tf.node.decodeImage(img_u8a);

  const pimg = await PImage.decodeJPEGFromStream(
    fs.createReadStream(imagePath)
  );

  const data = Array.from(pimg.data);

  const img_Tensor3D = await tf
    .tensor(data)
    .reshape([-1,pimg.width,4])
    .slice([0,0,0],[-1,-1,3]);

  return img_Tensor3D;
}

module.exports = {
  img_to_t3d,
}

