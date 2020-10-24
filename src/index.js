#!/usr/bin/env node
const prog = require('caporal');

process.env['TF_CPP_MIN_LOG_LEVEL'] = '2' //avoid tf message

const _posenet = require('./posenet')
const _blazeface = require('./blazeface')

const supports = ['posenet','blazeface']

prog
  .name('qtf')
//  .bin('qtf')
  .version(require('../package.json').version)
  .command('posenet', 'Using Posenet')
  .argument('<in-file-path>', 'input image file\nSupport for JPG,PNG,BMP')
  .option('-l <load-option>','useing load option by json')
  .option('-o <out-file-path>','output to jpeg')
  .action(async function(args, options, logger) {
    //console.log({args,options})

    let LoadOption = options.l ? JSON.parse(options.l) : {}
    let result = await _posenet.run(args.imageFilePath,LoadOption)

    if (options.o == null) {
      console.log(JSON.stringify(result))
      return
    }
    await _posenet.out_image(args.image,options.o,result)
  })
  .command('blazeface', 'Using blazeface')
  .argument('<in-file-path>', 'input image file\nSupport for JPG,PNG,BMP')
  .option('-o <outputImagePath>','output to jpeg')
  .action(async function(args, options, logger) {

    let result = await _blazeface.run(args.image)
    if (options.o == null) {
      console.log(JSON.stringify(result))
      return
    }
    await _blazeface.out_image(args.image,options.o,result)
  })
  .command('save', 'Download pre-trained moeles to local file')
  .argument('<model-name>', `pre-trained model name \n:[ ${['all',...supports].toString()} ]`,['all',...supports])
  .action(async function(args, options, logger) {
    if(/^(posenet|all)$/.test(args.modelName)) {
      _posenet.save_model();
    }
    if(/^(blazeface|all)$/.test(args.modelName)) {
      _blazeface.save_model();
    }
  });
prog.parse(process.argv);
