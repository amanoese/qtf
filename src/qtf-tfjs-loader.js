const tf = require('@tensorflow/tfjs');

let support_backend = []
const tf_loader = async ( backend ) => {
  //WASM works in a variety of environments, but some features are poorly implemented
  try { require('@tensorflow/tfjs-backend-wasm') } catch { }
  try { require('@tensorflow/tfjs-node') } catch { }

  support_backend = Object.keys(tf.engine().registryFactory);

  if(support_backend.includes(backend)){
    tf.setBackend(backend)
  } else if(support_backend.includes('tensorflow')) {
    tf.setBackend('tensorflow')
  } else {
    tf.setBackend('cpu')
  }
  await tf.ready()
  //console.log(support_backend)
  //console.log(tf.getBackend())
}

const tf_support_backend = () => {
  return support_backend
}

module.exports = {
  tf,
  tf_loader,
  tf_support_backend,
}
