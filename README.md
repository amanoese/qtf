Quick Tensorflow.js on CLI
---
[![Node CI](https://github.com/amanoese/qtf/workflows/Node%20CI/badge.svg?branch=master)](https://github.com/amanoese/qtf/actions?query=workflow%3A%22Node+CI%22+branch%3Amaster)
[![npm](https://img.shields.io/npm/v/qtf)](https://www.npmjs.com/package/qtf)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

This is the command to use the TensorFlow.js pre-trained models of  [tfjs-models](https://github.com/tensorflow/tfjs-models) with cli.  
If you want to use more features, I recommend using [tfjs-models](https://github.com/tensorflow/tfjs-models).

qtf is not Qtransformers.

## Install

If you using node.js on nodebrew ...

```bash
$ npm i -g qtf
```

### Manual

```bash
$ cd '<your any directory>'

$ git clone https://github.com/amanoese/gtf.git
$ cd qtf
$ npm install
$ npm link

## if you can not run 'npm link'.
$ echo "alias=$PWD/src/index.js" >> ~/.bashrc
$ source ~/.bashrc
```

### Windows

not support.
If you are using WSL2. See 'Maual Install'.

## Usage

```bash
$ qtf posenet input.jpg -o output.jpg
```

Let's open the output.jpg

| input.jpg | output.jpg |
| --- | --- |
| ![](https://raw.githubusercontent.com/amanoese/qtf/docs/doc/me.jpg) | ![](https://raw.githubusercontent.com/amanoese/qtf/docs/doc/me-posenet.jpg) |

### posenet

Output image file.
```bash
$ qtf posenet input.jpg -o ouput.jpg
```

Output JSON.
```bash
$ qtf posenet input.jpg
```

### blazeface

Output image file.
```bash
$ qtf blazeface input.jpg -o ouput.jpg
```

Output JSON.
```bash
$ qtf blazeface input.jpg
```

### mobilenet

```bash
$ qtf mobilenet input.jpg
```

### other models

```bash
$ qtf --help
```

### save

This command uses a trained model on the internet (Google Cloud Starage)..
If use offline or you use the command several times.
It's good idea to download trained model file to local.

```bash
$ qtf save all
```

But trained model data want to diskspace.
you can also choose the model to download.
See below for details.

```bash
$ qtf save --help
```

## Develop

```bash
$ npm install
$ npm link
$ qtf --help
```
### CI on Local

```bash
$ act -n
$ act push
```

## On the roadmap, but still missing

- Support tfjs-models
  - PoseNet
    - Support ResNet50
    - different model stride 
  - Coco SSD
  - BodyPix
  - DeepLab v3
  - handpose
  - facemesh
- Input Stream of UVC device.

