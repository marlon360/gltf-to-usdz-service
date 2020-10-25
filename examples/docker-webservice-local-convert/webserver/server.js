const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/local-convert', async (req, res) => {
    axios.post('http://gltf-to-usdz-service:3000/local-convert', {
        filename: req.body.filename
    }).then((result) => {
        console.log(result.data);
        res.send(result.data);
    }).catch((error) => {
        res.send({success: false, error: "Error while connecting to gltf-to-usdz-service"});
    })
})

app.listen(8080);
console.log('Listening on port 8080');