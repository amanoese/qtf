#!/usr/bin/env node
const { program } = require('@caporal/core');

process.env['TF_CPP_MIN_LOG_LEVEL'] = '2' //avoid tf message

const { tf, tf_loader, tf_support_backend } = require('./qtf-tfjs-loader');

const tempy = require('tempy');
const fsp = require('fs').promises;

const qtf_posenet = require('./qtf-posenet.js')
const qtf_blazeface = require('./qtf-blazeface.js')
const qtf_mobilenet = require('./qtf-mobilenet.js')
const qtf_bodyPix = require('./qtf-body-pix.js')
const qtf_deeplab = require('./qtf-deeplab.js')

const supports = ['posenet','blazeface','mobilenet','body-pix']

var stream = require('stream');
var util = require('util');

var writable = new stream.Writable({
  write: function(chunk, encoding, next) {
    console.log(chunk.toString());
    next();
  }
});

const input_pipe = (callback) => {
  //let stream = process.stdin.resume()
  var soi = Buffer.from([0xff, 0xd8]);
  var eoi = Buffer.from([0xff, 0xd9]);
  //console.log(stream)
  
  //stream.on('data',(data)=>{
  //  //console.log(data.indexOf(soi),data.indexOf(eoi),data.length)
  //  callback(data)
  //})
  var MjpegConsumer = require("mjpeg-consumer");
  var consumer = new MjpegConsumer();
  let stream = process.stdin.pipe(consumer).pipe(writable)
  process.stdin.resume()
}

program
  .name('qtf')
  .bin('qtf')
  .version(require('../package.json').version)
  .command('posenet', 'Using Posenet')
  .argument(
    '<in-file-path>',
    'input image file\nSupport for JPG,PNG,BMP'
   )
  .option('-l <load-option>','useing load option by json', { required :false })
  .option('-o <out-file-path>','output to jpeg', { required :false })
  .action(async function({args, options, logger}) {
    //console.log({args,options})
    let LoadOption = options.l ? JSON.parse(options.l) : {}

    let f = async (out_img) => {
      console.log({out_img})
      let result = await qtf_posenet.run(out_img||args.inFilePath,LoadOption)
      if (options.o == null) {
        console.log(JSON.stringify(result))
        return
      }
      await qtf_posenet.out_image(args.inFilePath,options.o,result)
    }
    let out_img = ''
    let p = f()
    input_pipe(()=>{})
    //input_pipe(data=>{
    //  p.then(()=>{
    //    out_img = tempy.file({extension:'jpg'})
    //    var soi = Buffer.from([0xff, 0xd8]);
    //    var eoi = Buffer.from([0xff, 0xd9]);
    //    console.log(data.indexOf(soi),data.indexOf(eoi),data.length)
    //    return fsp.writeFile(out_img,data)
    //  }).then(()=>{
    //    p = f(out_img)
    //  })
    //})
  })
  .command('blazeface', 'Using blazeface')
  .argument(
    '<in-file-path>',
    'input image file\nSupport for JPG,PNG,BMP'
   )
  .option('-o <out-file-path>','output to jpeg', { required :false })
  .action(async function({args, options, logger}) {

    let result = await qtf_blazeface.run(args.inFilePath)
    if (options.o == null) {
      console.log(JSON.stringify(result))
      return
    }
    await qtf_blazeface.out_image(args.inFilePath,options.o,result)
  })
  .command('mobilenet', 'Using mobilenet')
  .argument(
    '<in-file-path>',
    'input image file\nSupport for JPG,PNG,BMP'
   )
  .action(async function({args, options, logger}) {
    let result = await qtf_mobilenet.run(args.inFilePath)
    console.log(JSON.stringify(result))
  })
  .command('body-pix', 'Using body-pix')
  .argument(
    '<in-file-path>',
    'input image file\nSupport for JPG,PNG,BMP'
   )
  .option(
    '-a <raw-array>',
    'Does not convert the output JSON\'s Uinit8Array to an Array.'
   )
  .option('-o <out-file-path>','output to jpeg', { required :false })
  .action(async function({args, options, logger}) {
    let result = await qtf_bodyPix.run(args.inFilePath)

    if(options.a == null) {
      result = {
        ...result,
        data: Array.from(result.data)
      };
    }
    if(options.o == null) {
      console.log(JSON.stringify(result))
      return
    }
    await qtf_bodyPix.out_image(args.inFilePath,options.o,result)
  })
  .command('deeplab', 'Using DeepLab V3')
  .argument(
    '<in-file-path>',
    'input image file\nSupport for JPG,PNG,BMP'
   )
  .option(
    '-a <raw-array>',
    'Does not convert the output JSON\'s Uinit8Array to an Array.'
   )
  .option('-o <out-file-path>','output to jpeg', { required :false })
  .action(async function({args, options, logger}) {
    let result = await qtf_deeplab.run(args.inFilePath)

    if(options.a == null) {
      result = {
        ...result,
        segmentationMap: Array.from(result.segmentationMap)
      };
    }
    if(options.o == null) {
      console.log(JSON.stringify(result))
      return
    }
    await qtf_deeplab.out_image(args.inFilePath,options.o,result)
  })
  .command('backend', 'show supports tfjs backend and now setting')
  .action(async function({args, options, logger}) {
    console.log(`now      : ${tf.getBackend()}`)
    console.log(`supports : ${tf_support_backend()}`)
  })
  .command('save', 'Download pre-trained moeles to local file')
  .argument(
     '<model-name>',
     `pre-trained model name`,
     { validator : ['all',...supports] }
   )
  .action(async function({args, options, logger}) {
    if(/^(posenet|all)$/.test(args.modelName)) {
      qtf_posenet.save_model();
    }
    if(/^(blazeface|all)$/.test(args.modelName)) {
      qtf_blazeface.save_model();
    }
    if(/^(mobilenet|all)$/.test(args.modelName)) {
      qtf_mobilenet.save_model();
    }
    if(/^(body-pix|all)$/.test(args.modelName)) {
      qtf_bodyPix.save_model();
    }
    if(/^(deeplab|all)$/.test(args.modelName)) {
      qtf_deeplab.save_model();
    }
  });

tf_loader(process.env['QTF_BACKEND']).then(()=> {
  program.run();
})
//program.run(process.argv.slice(2))

