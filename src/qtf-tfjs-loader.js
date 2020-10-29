const tf = require('@tensorflow/tfjs');

const loader = () => {
  try {
    // auto-setting tf.setBackend ?
    require('@tensorflow/tfjs-node');
  } catch {
    require('@tensorflow/tfjs-core');
  }
  //console.log(tf.getBackend())
  return tf
}

module.exports= {
  loader
}
