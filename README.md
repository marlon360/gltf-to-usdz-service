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
    "outputPath": "inputfile.usdz"
}
```

On failure you receive this response:

```
{
    "success": false,
    "error": "Error Message"
}
```

## Examples

### Docker Compose setup with a NodeJS server

In `examples/docker-nodejs` you can see an example of a NodeJS webserver that uses the `gltf-to-usdz-service` with a docker-compose network.

Run this example by executing `docker-compose up --build` in `examples/docker-nodejs`.

#### Explanation

```
version: "3.8"
services:
  webserver:
    build: webserver/
    ports:
      - "8080:8080"
    volumes:
      - ./webserver/uploads:/usr/src/app/uploads
  gltf-to-usdz-service:
    image: marlon360/gltf-to-usdz-service:latest
    volumes:
      - ./webserver/uploads:/usr/app
```

The *webserver* service is a NodeJS server, which runs a frontend and has an API endpoint for uploading and converting files.
The API uses the *gltf-to-usdz-service* service to convert the uploaded file to `.usdz`. 

This is possible by sending a POST request to `http://gltf-to-usdz-service:3000/local-convert` to convert a `.gltf` located in `./webserver/uploads/`.

You can see that the uploads directory is shared by the *webserver* and the *gltf-to-usdz-service* to access the uploaded files.