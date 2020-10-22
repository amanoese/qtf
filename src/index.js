#!/usr/bin/env node
const prog = require('caporal');
prog
  .name('qtf')
//  .bin('qtf')
  .version(require('../package.json').version)
  .command('posenet', 'Using Posenet')
  .argument('<image>', 'image')
  .option('-l <LoadOption>','useing load option by json')
  .option('-o <outputImagePath>','output to jpeg')
  .action(async function(args, options, logger) {
    const posenet = require('./posenet')
    //console.log({args,options})
    let result = await posenet.run(args.image,options.l)

    if (options.o == null) {
      console.log(JSON.stringify(result))
      return
    }
    await posenet.out_image(args.image,options.o,result)
  })
  .command('cocossd', 'Using Coco SSD')
  .option('--tail <lines>', 'Tail <lines> lines of logs after deploy', prog.INT)
  .action(function(args, options, logger) {
  });
 
prog.parse(process.argv);
