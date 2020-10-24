Quick Tensorflow.js on CLI
---
This is the command to use the TensorFlow.js pre-trained moeles with cli.

is not Qtransformers.

## Usage

```bash
$ qtf posenet input.jpg -o output.jpg
```
Let's open the output.jpg

### save

This command uses a trained model on the internet (Google Cloud Starage).
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
$ qtf posenet input.jpg -o ouput.jpg
```

Output JSON.
```bash
$ qtf posenet input.jpg
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

### On the roadmap, but still missing

- Support tfjs-models
  - MobileNet
  - PoseNet
    - Support ResNet50
    - different model stride 
  - Coco SSD
  - BodyPix
  - DeepLab v3
  - hanpose
  - facemesh
- Input Stream of UVC device.

