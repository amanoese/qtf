const fsp = require('fs').promises;
const tf = require('@tensorflow/tfjs-node');

const img_to_t3d = async (imagePath) => {
  const imgFile = await fsp.readFile(imagePath);
  const img_u8a = new Uint8Array(imgFile);
  const img_Tensor3D = tf.node.decodeJpeg(img_u8a);
  return img_Tensor3D;
}

module.exports = {
  img_to_t3d,
}

