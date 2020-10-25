const { exec } = require("child_process");
const { workerData, parentPort } = require("worker_threads")

convertFile(workerData.filename).then((filename) => {
    parentPort.postMessage({ success: true, filename: filename })
}).catch((error) => {
    parentPort.postMessage({ success: false, error: error })
});

function convertFile(filename) {
    const nameWithoutExtension = filename.split('.').slice(0, -1).join('.');
    return new Promise((resolve, reject) => {
        exec(`usd_from_gltf /usr/app/${filename} /usr/app/${nameWithoutExtension}.usdz`, (error, stdout, stderr) => {
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