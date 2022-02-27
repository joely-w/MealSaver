/**
 * API for Meal Saver
 */

const http = require('http');
const express = require('express');
const multer = require('multer');
const upload = multer();
const fs = require('fs');
const bodyParser = require('body-parser')
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/../ui"));
const dbConn = new (require("./services/database.js"))();
const ocr = new (require("./services/recieptOcr"))();
const inventory = new (require('./services/inventory'))();
// default URL for website
const server = http.createServer(app);
app.post('/api/upload/receipt', upload.single('file'), async (req, res) => {
    const filename = `./tmp/${(Math.random() + 1).toString(36).substring(7)}.jpeg`;
    await fs.writeFile(filename, req.file.buffer, async (err) => {
        if (err) return res.status(500).send('Error uploading image')
        const result = await ocr.parseReceipt(filename)
        return res.send(result);
    })
});
app.post('/api/save/inventory', async (req, res) => {
    await ocr.addToInventory(req.body)
    // TODO Needs to send a user parameter when sessions are implemented
    res.status(200).send('OK');
})
const port = 3001;
server.listen(port);
console.debug('Server listening on port ' + port);