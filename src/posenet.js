const fs = require('fs');
const fsp = require('fs').promises;
const tf = require('@tensorflow/tfjs-node');
//const tf = require('@tensorflow/tfjs-node-gpu');
const posenet = require('@tensorflow-models/posenet');

let img_to_t3d = async (imagePath) => {
  const imgFile = await fsp.readFile(imagePath);
  const img_u8a = new Uint8Array(imgFile);
  const img_Tensor3D = tf.node.decodeJpeg(img_u8a);
  return img_Tensor3D;
}

async function run (imagePath,LoadOption = {}) {
  const [ net, img_Tensor3D ] = await Promise.all([
    await posenet.load(),
    await img_to_t3d(imagePath)
  ]);

  const pose = await net.estimateSinglePose(img_Tensor3D,LoadOption);
  return pose
}

async function out_image (imagePath,outPath = './out.jpg',result = {}) {

  const PImage = require('pureimage');
  let pimg = await PImage.decodeJPEGFromStream(fs.createReadStream(imagePath))

  //console.log('size is',pimg.width,pimg.height);
  const img2 = PImage.make(pimg.width,pimg.height);

  var ctx = img2.getContext('2d');
  ctx.drawImage(pimg,
      0, 0, pimg.width, pimg.height, // source dimensions
      0, 0, pimg.width, pimg.height, // destination dimensions
  );

  ctx.fillStyle = '#00ff00';

  result.keypoints.filter(({score})=>{
    //console.log({score,x,y})
    return score > 0.5
  }).forEach(point => {
    let { position : { x, y } } = point
    ctx.beginPath();
    ctx.arc(x,y,10,0, Math.PI*2);
    ctx.closePath();
    ctx.fill()
  })

  await PImage.encodeJPEGToStream(img2,fs.createWriteStream(outPath), 100);
  console.log(`done writing To "${outPath}"`);
}


module.exports = {
  run,
  out_image
}

