const fs = require('fs');
const fsp = require('fs').promises;
const tf = require('@tensorflow/tfjs-node');
//const tf = require('@tensorflow/tfjs-node-gpu');
const blazeface = require('@tensorflow-models/blazeface');
const PImage = require('pureimage');
const { img_to_t3d } = require('./utils.js');

let load_model = async (loadOption = {}) => {
  try {
    await fsp.access('./models/blazeface/model.json')
    // '@tensorflow-models/blazeface' is not support modelurl option.
    // https://github.com/tensorflow/tfjs-models/pull/534
    // https://github.com/tensorflow/tfjs-models/blob/master/blazeface/src/index.ts#L36-L50

    let option = {
      maxFaces = 10,
      inputWidth = 128,
      inputHeight = 128,
      iouThreshold = 0.3,
      scoreThreshold = 0.75
    } = { ...loadOption }

    console.warn('[QTF] Using local model');
    let tfmodel = await tf.loadGraphModel('file://./models/blazeface/model.json');
    return new blazeface.BlazeFaceModel(
      tfmodel,
      inputWidth, inputHeight, maxFaces, iouThreshold, scoreThreshold
    );
  } catch (err) {
    return await blazeface.load(loadOption);
  }
}

async function run(imagePath) {

  let model = await load_model();
  let img_Tensor3D = await img_to_t3d(imagePath)

  const predictions = await model.estimateFaces(img_Tensor3D);
  return predictions
}
async function save_model () {
  //TODO: Not enough because posenet is multiple models.
  const model = await blazeface.load();
  await model.blazeFaceModel.save('file://./models/blazeface')
  console.log('save blazeface!')
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

  result.filter(({probability})=>{
    //return probability > 0.5
    return true
  }).forEach(face => {
    let [ x1, y1 ] = face.topLeft
    let [ x2, y2 ] = face.bottomRight
    let [ width, height ] = [(x2 - x1) , (y2 - y1)]
    ctx.fillStyle = 'rgba(255,0,0, 0.5)';
    ctx.fillRect( x1, y1, width, height);

    const point_size = (pimg.width / 50)
    ctx.fillStyle = '#0000ff';

    face.landmarks.forEach(point => {
      let [ x, y ] = point
      ctx.beginPath();
      ctx.arc(x,y,point_size,0, Math.PI*2);
      ctx.closePath();
      ctx.fill()
    })
  })

  await PImage.encodeJPEGToStream(img2,fs.createWriteStream(outPath), 100);
}

module.exports = {
  run,
  save_model,
  out_image,
}

