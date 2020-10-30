const fs = require('fs');
const fsp = require('fs').promises;
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-core');
//const tf = require('@tensorflow/tfjs-core-gpu');
const bodyPix = require('@tensorflow-models/body-pix');
const PImage = require('pureimage');
const { img_to_t3d } = require('./utils.js');


let load_model = async (loadOption = {}) => {
  try {
    await fsp.access('./models/body-pix/model.json')
    console.warn('[QTF] Using local model');

    return await bodyPix.load({
      modelUrl:'file://./models/body-pix/model.json',
      ...loadOption
    });
  } catch (err) {
    return  await bodyPix.load(loadOption);
  }
}

async function save_model () {
  let net = await bodyPix.load();
  await net.baseModel.model.save('file://./models/body-pix')
  console.log('save body-pix!')
}

async function run (imagePath,loadOption) {
  const [ net, img_Tensor3D ] = await Promise.all([
    await load_model(loadOption),
    await img_to_t3d(imagePath)
  ]);

  const segmentation = await net.segmentPerson(img_Tensor3D);
  return segmentation
}

async function out_image (imagePath,outPath = './out.jpg',result = {}) {

  let pimg = await PImage.decodeJPEGFromStream(fs.createReadStream(imagePath))

  //console.log('size is',pimg.width,pimg.height);
  const img2 = PImage.make(pimg.width,pimg.height);

  const ctx = img2.getContext('2d');
  ctx.drawImage(pimg,
      0, 0, pimg.width, pimg.height, // source dimensions
      0, 0, pimg.width, pimg.height, // destination dimensions
  );

  result.data.forEach((param,index)=>{
    let x = index % pimg.width
    let y = parseInt(index / pimg.width)

    ctx.fillStyle = param ? 'rgba(255,255,255, 0.5)' : 'rgba(0,0,0, 0.5)'
    ctx.fillRect(x,y,1,1);
  })

  //const point_size = (pimg.width / 50)
  //ctx.fillStyle = 'rgba(0,255,0,0.7)';

  //result.allPoses.forEach(pose => {
  //  pose.keypoints.filter(({score})=>{
  //    //console.log({score,x,y})
  //    return score > 0.5
  //  }).forEach(point => {
  //    let { position : { x, y } } = point
  //    ctx.beginPath();
  //    ctx.arc(x,y,point_size,0, Math.PI*2);
  //    ctx.closePath();
  //    ctx.fill()
  //  })
  //})

  await PImage.encodeJPEGToStream(img2,fs.createWriteStream(outPath), 100);
  //console.log(`done writing To "${outPath}"`);
}

module.exports = {
  load_model,
  save_model,
  run,
  out_image,
}

