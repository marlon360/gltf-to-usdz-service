const { Worker, isMainThread } = require('worker_threads');
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
const app = express()
const port = 3000

app.use(bodyParser.json());

app.post('/local-convert', (req, res) => {
  const filename = req.body.filename;
  if (filename == null) {
    res.send({error: "No filename defined in the request"});
    return;
  }
  if(isMainThread){

    let thread = new Worker(path.resolve(__dirname, 'threads/converter_thread.js'), { workerData : { filename : filename } });

    thread.on('message',(data) => {
      res.send(data);
    })

    thread.on("error",(err) => {
      res.send({success: false, error: err});
    })

    thread.on('exit',(code) => {
        if(code != 0) {
          console.log("Worker Thread exited with code: " + code);
        }
    })   
  }
})

app.listen(port, () => {
  console.log(`USDZ Converter Server running at http://localhost:${port}`)
})