const fs = require('fs');
const fsp = require('fs').promises;
const tf = require('@tensorflow/tfjs-node');
//const tf = require('@tensorflow/tfjs-node-gpu');
const posenet = require('@tensorflow-models/posenet');
const { img_to_t3d } = require('./utils');

let load_posenet = async (LoadOption = {}) => {
  let option = {};
  let err = await fsp.access('./models/posenet/model.json')
  if(!err) {
    console.warn('[QTF] Using local model');
    option = {
      modelUrl:'file://./models/posenet/model.json',
    };
  }
  return await posenet.load({ ...option, ...LoadOption });
}

async function save_model () {
  //TODO: Not enough because posenet is multiple models.
  let net = await posenet.load()
  await net.baseModel.model.save('file://./models/posenet')
  console.log('save posenet!')
}
async function run (imagePath,LoadOption) {
  const [ net, img_Tensor3D ] = await Promise.all([
    await load_posenet(),
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
  //console.log(`done writing To "${outPath}"`);
}


module.exports = {
  save_model,
  run,
  out_image
}

