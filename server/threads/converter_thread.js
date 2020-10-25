const { exec } = require("child_process");
const { workerData, parentPort } = require("worker_threads");
const path = require('path');

convertFile(workerData.filename).then((filename) => {
    parentPort.postMessage({ success: true, filename: filename })
}).catch((error) => {
    parentPort.postMessage({ success: false, error: error })
});

function convertFile(filepath) {
    if (path.isAbsolute(filepath)) {
        reject("Absolute paths are not allowed!");
        return;
    }
    const filename = path.basename(filepath);
    const nameWithoutExtension = filename.split('.').slice(0, -1).join('.');
    const dirname = path.dirname(filepath);
    const tmpFolder = randomString();
    return new Promise((resolve, reject) => {
        exec(`usd_from_gltf /usr/app/${filepath} /usr/app/${tmpFolder}/${nameWithoutExtension}.usdz && mv /usr/app/${tmpFolder}/${nameWithoutExtension}.usdz /usr/app/${dirname} && rmdir /usr/app/${tmpFolder}`, (error, stdout, stderr) => {
        if (error) {
            reject(error.message);
            return;
        }
        if (stderr) {
            reject(stderr);
            return;
        }
        resolve(`${nameWithoutExtension}.usdz`);
        });
    })
}

function randomString() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
}