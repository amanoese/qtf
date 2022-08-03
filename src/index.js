#!/usr/bin/env node
process.env['TF_CPP_MIN_LOG_LEVEL'] = '2' //avoid tf message

const { tf, tf_loader, tf_support_backend } = require('./qtf-tfjs-loader');

const qtf = {
  posenet : require('./qtf-posenet.js'),
  blazeface : require('./qtf-blazeface.js'),
  mobilenet : require('./qtf-mobilenet.js'),
  bodyPix : require('./qtf-body-pix.js'),
  deeplab : require('./qtf-deeplab.js')
}

const supports = Object.keys(qtf)


let default_runner = async (argv) => {
  let qtf_model = qtf[argv._]
  let LoadOption = argv.l ? JSON.parse(argv.l) : {}
  let result = await qtf_model.run(argv.inFilePath,LoadOption)

  if (argv.o == null) {
    console.log(JSON.stringify(result))
    return
  }
  await qtf_model.out_image(argv.inFilePath,argv.o,result)
}
const default_options = (yargs) => {
  return yargs
    .positional('in-file-path', { describe: 'input image file. (format JPG,PNG,BMP)' })
    .option('l',{ alias: 'load-option', describe: 'using load option by json' })
    .option('o',{ alias: 'out-file-path', describe: 'output to jpeg' })
}

tf_loader(process.env['QTF_BACKEND']).then(()=> {
  const yargs = require('yargs/yargs')(process.argv.slice(2))
    .scriptName("qtf")
    .command('posenet <in-file-path>', 'Using Posenet',
      default_options,
      default_runner
    )
    .command('blazeface <in-file-path>', 'Using blazeface',
      default_options,
      default_runner
    )
    .command('mobilenet <in-file-path>', 'Using mobilenet',
      default_options,
      default_runner
    )
    .command('body-pix <in-file-path>', 'Using body-pix',
      (yargs) => {
        return default_options(yargs)
          .option('a',{ alias: 'raw-array', describe: 'Does not convert the output JSON\'s Uinit8Array to an Array.' })
      },
      async function(argv) {
        let result = await qtf.bodyPix.run(argv.inFilePath)

        if(argv.a == null) {
          result = {
            ...result,
            data: Array.from(result.data)
          };
        }
        if(argv.o == null) {
          console.log(JSON.stringify(result))
          return
        }
        await qtf.bodyPix.out_image(argv.inFilePath,argv.o,result)
      }
    )
    .command('deeplab <in-file-path>', 'Using deeplab',
      (yargs) => {
        return default_options(yargs)
          .option('a',{ alias: 'raw-array', describe: 'Does not convert the output JSON\'s Uinit8Array to an Array.' })
      },
      async function(argv) {
        let result = await qtf.deeplab.run(argv.inFilePath)

        if(argv.a == null) {
          result = {
            ...result,
            segmentationMap: Array.from(result.segmentationMap)
          }
        }

        if(argv.o == null) {
          console.log(JSON.stringify(result))
          return
        }
        await qtf.deeplab.out_image(argv.inFilePath,argv.o,result)
      }
    )
    .command('backend', 'show supports tfjs backend and now setting',{},
      async function(argv) {
        console.log(`now      : ${tf.getBackend()}`)
        console.log(`supports : ${tf_support_backend()}`)
      }
    )
    .command('save <model-name>', 'Download pre-trained moeles to local file',
      (argv) =>{
        return argv.choices('model-name', [ ...supports, 'all' ])
      },
      async function(argv) {
        if(/^(posenet|all)$/.test(argv.modelName)) {
          qtf.posenet.save_model();
        }
        if(/^(blazeface|all)$/.test(argv.modelName)) {
          qtf.blazeface.save_model();
        }
        if(/^(mobilenet|all)$/.test(argv.modelName)) {
          qtf.mobilenet.save_model();
        }
        if(/^(body-pix|all)$/.test(argv.modelName)) {
          qtf.bodyPix.save_model();
        }
        if(/^(deeplab|all)$/.test(argv.modelName)) {
          qtf.deeplab.save_model();
        }
      }
    )
    .usage('qtf <command>')
    .command({
      command: '*',
      handler() {
        yargs.showHelp()
      }
    })
    .example([
      ['qtf posenet sample.jpg','#usage posenet'],
      ['qtf posenet sample.jpg -o output.jpg','#usage output file']
    ])
    .help()
    .detectLocale(false)
  yargs.parse()
})
