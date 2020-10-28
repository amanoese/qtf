#!/usr/bin/env node
const { program } = require('@caporal/core');



process.env['TF_CPP_MIN_LOG_LEVEL'] = '2' //avoid tf message

const _posenet = require('./qtf-posenet.js')
const _blazeface = require('./qtf-blazeface.js')
const _mobilenet = require('./qtf-mobilenet.js')
const _bodyPix = require('./qtf-body-pix.js')
const _deeplab = require('./qtf-deeplab.js')

const supports = ['posenet','blazeface','mobilenet','body-pix']

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
    let result = await _posenet.run(args.inFilePath,LoadOption)

    if (options.o == null) {
      console.log(JSON.stringify(result))
      return
    }
    await _posenet.out_image(args.inFilePath,options.o,result)
  })
  .command('blazeface', 'Using blazeface')
  .argument(
    '<in-file-path>',
    'input image file\nSupport for JPG,PNG,BMP'
   )
  .option('-o <out-file-path>','output to jpeg', { required :false })
  .action(async function({args, options, logger}) {

    let result = await _blazeface.run(args.inFilePath)
    if (options.o == null) {
      console.log(JSON.stringify(result))
      return
    }
    await _blazeface.out_image(args.inFilePath,options.o,result)
  })
  .command('mobilenet', 'Using mobilenet')
  .argument(
    '<in-file-path>',
    'input image file\nSupport for JPG,PNG,BMP'
   )
  .action(async function({args, options, logger}) {
    let result = await _mobilenet.run(args.inFilePath)
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
    let result = await _bodyPix.run(args.inFilePath)

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
    await _bodyPix.out_image(args.inFilePath,options.o,result)
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
    let result = await _deeplab.run(args.inFilePath)

    if(options.a == null) {
      result = {
        ...result,
        data: Array.from(result.segmentationMap)
      };
    }
    if(options.o == null) {
      console.log(JSON.stringify(result))
      return
    }
    await _deeplab.out_image(args.inFilePath,options.o,result)
  })
  .command('save', 'Download pre-trained moeles to local file')
  .argument(
     '<model-name>',
     `pre-trained model name`,
     { validator : ['all',...supports] }
   )
  .action(async function({args, options, logger}) {
    if(/^(posenet|all)$/.test(args.modelName)) {
      _posenet.save_model();
    }
    if(/^(blazeface|all)$/.test(args.modelName)) {
      _blazeface.save_model();
    }
    if(/^(mobilenet|all)$/.test(args.modelName)) {
      _mobilenet.save_model();
    }
    if(/^(body-pix|all)$/.test(args.modelName)) {
      _bodyPix.save_model();
    }
  });

program.run();
//program.run(process.argv.slice(2))

