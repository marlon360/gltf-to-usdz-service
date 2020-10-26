const { exec } = require("child_process");
const { workerData, parentPort } = require("worker_threads");
const path = require('path');

convertFile(workerData.filename).then((outputPath) => {
    parentPort.postMessage({ success: true, outputPath: outputPath })
}).catch((error) => {
    parentPort.postMessage({ success: false, error: error })
});

function convertFile(filepath) {
    // absolute paths are not allowed
    if (path.isAbsolute(filepath)) {
        reject("Absolute paths are not allowed!");
        return;
    }

    // construct absolute path by adding the working dir
    const absolutePath = path.normalize(`/usr/app/${filepath}`);

    // check if path is outside of working dir
    if (!absolutePath.startsWith("/usr/app/")) {
        reject("You are trying to access a path outside of the working directory");
        return;
    }
    const filename = path.parse(absolutePath).name;
    const dirname = path.dirname(absolutePath);
    const tmpFolder = randomString();
    return new Promise((resolve, reject) => {
        exec(`usd_from_gltf ${absolutePath} /usr/app/${tmpFolder}/${filename}.usdz && mv /usr/app/${tmpFolder}/${filename}.usdz ${dirname} && rmdir /usr/app/${tmpFolder}`, (error, stdout, stderr) => {
        if (error) {
            reject(error.message);
            return;
        }
        if (stderr) {
            reject(stderr);
            return;
        }
        resolve(path.relative("/usr/app/", `${dirname}/${filename}.usdz`));
        });
    })
}

function randomString() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
}