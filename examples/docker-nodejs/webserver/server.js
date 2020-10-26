const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
var multer  = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})
  
var upload = multer({ storage: storage })

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/convert', upload.single('uploaded_file'), function (req, res, next) {
    axios.post('http://gltf-to-usdz-service:3000/local-convert', {
        filename: req.file.filename
    }).then((result) => {
        console.log(result.data);
        res.send(result.data);
    }).catch((error) => {
        res.send({success: false, error: "Error while connecting to gltf-to-usdz-service"});
    })
});

app.get("/download", function (req, res, next) {
    var filename = req.query.file; 
    const file = `${__dirname}/uploads/${filename}`;
    res.download(file);
})

app.listen(8080);
console.log('Listening on port 8080');