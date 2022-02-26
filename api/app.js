/**
 * API for Meal Saver
 */

const http = require('http');
const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(__dirname+"/../ui"));
// default URL for website
const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);