# GLTF to USDZ Service

## What's this repository about?

If you want to convert a `.gltf` file to an `.usdz` file you need a quite complex setup. This repository aims to simplify the whole conversion process by using a docker container.

We use the *usd_from_gltf* repository from Google [google/usd_from_gltf](https://github.com/google/usd_from_gltf) in conjunction with the *USD* repository from PixarAnimationStudios [PixarAnimationStudios/USD](https://github.com/PixarAnimationStudios/USD).

Since *USD* takes a long time to build, it has its own docker image (see `\usd`). You can find it on Docker Hub. https://hub.docker.com/r/marlon360/usd

The *usd_from_gltf* tool can be found in `usd-from-gltf` and is online at https://hub.docker.com/r/marlon360/usd-from-gltf.


## How to run?

### CLI

Run the docker command:

`docker run -it --rm -v $(PWD):/usr/app marlon360/usd-from-gltf:latest inputfile.glb outputfile.usdz`

### Webservice

Start the server:

`docker run -it --rm -v $(PWD):/usr/app -p 8080:3000 marlon360/gltf-to-usdz-service:latest`

#### Convert a local file

Send a `POST` request to the endpoint `/local-convert` (here: *localhost:8080/local-convert*) with this body:

```
{
    "filename": "inputfile.glb"
}
```

If the file exists in the volume you connected to the server (in the example it is ${PWD}) the service converts it and saves it in the same folder.

On success you receive this response:

```
{
    "success": true,
    "filename": "inputfile.usdz"
}
```

## Examples

### Docker Compose

```
version: "3.8"
services:
  webserver:
    build: webserver/
    ports:
      - "8080:8080"
  gltf-to-usdz-service:
    image: marlon360/gltf-to-usdz-service:latest
    volumes:
      - ./webserver/public/static_files:/usr/app
```

With this compose file you can send a POST request from *webserver* to `http://gltf-to-usdz-service:3000/local-convert` to convert a `.gltf` located in `./webserver/public/static_files`.