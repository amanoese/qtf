const fs = require('fs');
const fsp = require('fs').promises;
const tf = require('@tensorflow/tfjs-node');
//const tf = require('@tensorflow/tfjs-node-gpu');
const PImage = require('pureimage');
const { img_to_t3d } = require('./utils.js');

const deeplab = require('@tensorflow-models/deeplab');
const utils = require('@tensorflow-models/deeplab/dist/utils');

let load_model = async (loadOption = {}) => {
  try {
    await fsp.access('./models/deeplab/model.json')
    console.warn('[QTF] Using local model');

    return await deeplab.load({
      base: 'pascal',
      quantizationBytes: 2,
      modelUrl:'file://./models/deeplab/model.json',
      ...loadOption
    });
  } catch (err) {
    console.error(err)
    return await deeplab.load()
  }
}

async function save_model () {
  let _model = await deeplab.load()
  await _model.model.save('file://./models/deeplab')
  console.log('save deeplab!')
}

async function run (imagePath,LoadOption) {
  const [ model, img_Tensor3D ] = await Promise.all([
    await load_model(),
    await img_to_t3d(imagePath)
  ]);

  // check https://github.com/tensorflow/tfjs/issues/3723
  deeplab.SemanticSegmentation.prototype.predict = function (input) {
    return tf.tidy(() => {
        const data = utils.toInputTensor(input);
        return tf.squeeze(this.model.execute(tf.cast(data,"int32")));
    });
  };


  const colormap = deeplab.getColormap(model.base);
  const labels   = deeplab.getLabels(model.base);

  const predictions = await model.segment(img_Tensor3D);
  //const predictions = await model.predict(img_Tensor3D);
  return predictions;
}

async function out_image (imagePath,outPath = './out.jpg',predictions) {

  let pimg = await PImage.decodeJPEGFromStream(fs.createReadStream(imagePath))

  //console.log('size is',pimg.width,pimg.height);
  const img2 = PImage.make(predictions.width,predictions.height);

  const ctx = img2.getContext('2d');
  ctx.drawImage(pimg,
      0, 0, pimg.width, pimg.height, // source dimensions
      0, 0, predictions.width,predictions.height, // destination dimensions
  );

  const tf_data = await tf.reshape(
    Array.from(predictions.segmentationMap)
    ,[-1,predictions.width,4]
  );

  let data2d = await tf_data.array();

  data2d.forEach((dataLine,y)=>{
    dataLine.forEach((param,x)=>{
      let [R,G,B,Alpha] = param

      ctx.fillStyle = `rgba(${R},${G},${B},0.8)`
      //ctx.fillStyle = `rgba(${R},${G},${B},1)`
      ctx.fillRect(x,y,1,1);
    })
  })

  await PImage.encodeJPEGToStream(img2,fs.createWriteStream(outPath), 100);
  //console.log(`done writing To "${outPath}"`);
}

module.exports = {
  save_model,
  run,
  out_image,
}

