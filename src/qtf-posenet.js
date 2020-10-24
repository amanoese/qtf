const fs = require('fs');
const fsp = require('fs').promises;
const tf = require('@tensorflow/tfjs-node');
//const tf = require('@tensorflow/tfjs-node-gpu');
const posenet = require('@tensorflow-models/posenet');
const PImage = require('pureimage');
const { img_to_t3d } = require('./utils.js');

let load_model = async (LoadOption = {}) => {
  try {
    await fsp.access('./models/posenet/model.json')
    console.warn('[QTF] Using local model');

    return await posenet.load({
      modelUrl:'file://./models/posenet/model.json',
      ...LoadOption
    });
  } catch (err) {
    return await posenet.load({ ...LoadOption });
  }
}

async function save_model () {
  //TODO: Not enough because posenet is multiple models.
  let net = await posenet.load()
  await net.baseModel.model.save('file://./models/posenet')
  console.log('save posenet!')
}

async function run (imagePath,LoadOption) {
  const [ net, img_Tensor3D ] = await Promise.all([
    await load_model(),
    await img_to_t3d(imagePath)
  ]);

  const pose = await net.estimateSinglePose(img_Tensor3D,LoadOption);
  return pose
}

async function out_image (imagePath,outPath = './out.jpg',result = {}) {

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
  //console.log(`done writing To "${outPath}"`);
}

module.exports = {
  //load_model,
  save_model,
  run,
  out_image
}
