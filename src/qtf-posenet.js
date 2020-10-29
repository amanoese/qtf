const fs = require('fs');
const fsp = require('fs').promises;
const PImage = require('pureimage');
const { img_to_t3d } = require('./utils.js');
const { loader } = require('./qtf-tfjs-loader.js');
const tf = loader()
const posenet = require('@tensorflow-models/posenet');

let load_model = async (loadOption = {}) => {
  let option = {
    architecture = 'MobileNetV1',
    outputStride = 16,
    multiplier   = 1
  } = { ...loadOption };

  try {
    await fsp.access('./models/posenet/model.json')
    console.warn('[QTF] Using local model');

    return await posenet.load({
      modelUrl:'file://./models/posenet/model.json',
      ...option
    });
  } catch (err) {
    return await posenet.load(option);
  }
}

async function save_model () {
  //TODO: Not enough because posenet is multiple models.
  let net = await posenet.load()
  await net.baseModel.model.save('file://./models/posenet')
  console.log('save posenet!')
}

async function run (imagePath,loadOption = {}) {

  let pimg = await PImage.decodeJPEGFromStream(fs.createReadStream(imagePath))

  const [ net, img_Tensor3D ] = await Promise.all([
    await load_model({
      inputResolution:{ width:pimg.width, height:pimg.height },
      ...loadOption,
    }),
    await img_to_t3d(imagePath)
  ]);

  const pose = await net.estimateSinglePose(img_Tensor3D);
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

  const point_size = Math.max((pimg.width / 200).toFixed(),5)
  ctx.fillStyle = '#00ff00';

  result.keypoints.filter(({score})=>{
    //console.log({score,x,y})
    return score > 0.5
  }).forEach(point => {
    let x = point.position.x
    let y = point.position.y

    ctx.beginPath();
    ctx.arc(x,y,point_size,0, Math.PI*2);
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

