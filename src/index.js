//#!/usr/bin/env node
const prog = require('caporal');
const _posenet = require('./posenet')
const _blazeface = require('./blazeface')
const supports = ['posenet','blazeface']

prog
  .name('qtf')
//  .bin('qtf')
  .version(require('../package.json').version)
  .command('posenet', 'Using Posenet')
  .argument('<image>', 'image')
  .option('-l <LoadOption>','useing load option by json')
  .option('-o <outputImagePath>','output to jpeg')
  .action(async function(args, options, logger) {
    //console.log({args,options})

    let LoadOption = options.l ? JSON.parse(options.l) : {}
    let result = await _posenet.run(args.image,LoadOption)

    if (options.o == null) {
      console.log(JSON.stringify(result))
      return
    }
    await _posenet.out_image(args.image,options.o,result)
  })
  .command('blazeface', 'Using blazeface')
  .argument('<image>', 'image')
  .option('-o <outputImagePath>','output to jpeg')
  .action(async function(args, options, logger) {
    let result = await _blazeface.run(args.image)
    if (options.o == null) {
      console.log(JSON.stringify(result))
      return
    }
    await _blazeface.out_image(args.image,options.o,result)
  })
  .command('save', 'download pre-trained moeles to local file')
  .argument('<modelname>', `pre-trained model name \n:[ ${['all',...supports].toString()} ]`,['all',...supports])
  .action(async function(args, options, logger) {
    if(/^(posenet|all)$/.test(args.modelname)) {
      _posenet.save_model();
    }
    if(/^(blazeface|all)$/.test(args.modelname)) {
      _blazeface.save_model();
    }
  });
prog.parse(process.argv);
