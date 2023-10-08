// Imports
const path = require('path');
const http = require('http');
const fs = require('fs');

// Base directory
const dir = "./";

// Mime data
const mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

// Create an HTTP server
const server = http.createServer((req, res) => {

    const reqpath = decodeURI(req.url.toString()).split('?')[0];


    if (req.method !== 'GET') {
        res.statusCode = 501;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Method not implemented');
    }

    // Get the file path
    const file = path.join(dir, reqpath.replace(/\/$/, '/index.html'));

    // Get the file type
    const type = mime[path.extname(file).slice(1)] || 'text/plain';

    // Open the file
    const file_stream = fs.createReadStream(file);

    // 200 OK
    file_stream.on('open', function () {

        // Set the content type in the response header
        res.setHeader('Content-Type', type);
        file_stream.pipe(res);
    });
    
    // 404 Not Found
    file_stream.on('error', function () {
        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 404;
        res.end('Not found');
    });
});

// Start a loopback server on port 3000
server.listen(3000, function () {
    console.log('Listening on http://localhost:3000/');
});