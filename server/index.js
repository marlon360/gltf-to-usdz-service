const { Worker, isMainThread, workerData } = require('worker_threads');
const { exec } = require("child_process");
const express = require('express')
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

    let thread = new Worker('./threads/converter_thread.js',{ workerData : { filename : filename } });

    thread.on('message',(data) => {
      res.send(data);
    })

    thread.on("error",(err) => {
      res.send({error: error});
    })

    thread.on('exit',(code) => {
        if(code != 0) {
          res.send({error: code});
        }
    })   
  }
})

app.listen(port, () => {
  console.log(`USDZ Converter Server running at http://localhost:${port}`)
})