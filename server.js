
// This is supposed to be a basic server implementation for development purposes.
const port = 80, root = '.';
const http = require('http'), url = require('url'), fs = require('fs'), net = require('net');

const server = http.createServer(function (request, response) {
    const pathname = url.parse(request.url).pathname;
    
    switch (request.method) {
        case 'GET': get(pathname, request, response); break;
        case 'HEAD': get(pathname, request, response); break;
        default:
            response.writeHead(501);
            response.end();
            logHttpRequest(request, response);
            break;
    }
});

/**
 * @param {String} pathname 
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function get(pathname, request, response) {
    resolveFile(root + pathname, (resolvedFile) => {
        if (resolvedFile === undefined) {
            response.writeHead(404);
            response.end();
            logHttpRequest(request, response);
            return;
        }

        const stream = fs.createReadStream(resolvedFile);
        stream.on('open', () => {
            response.writeHead(200, {'Content-Type': getContentType(resolvedFile)});
            stream.pipe(response);
        });
        stream.on('end', () => {
            logHttpRequest(request, response, resolvedFile);
        });
        stream.on('error', (err) => {
            response.end(err);
            logHttpRequest(request, response);
        });
    });
}

/**
 * @param {String} pathname 
 * @param {Function} callback 
 */
function resolveFile(pathname, callback) {
    let i = 0; loop();
    function loop() {
        if (i >= autoComplete.length) return callback();
        const temp = pathname + autoComplete[i++]
        fs.stat(temp, (err, result) => {
            if (err || result.isDirectory() || filterPathname(temp)) return loop();
            callback(temp);
        });
    }
}

/**
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 * @param {String} resolved 
 */
function logHttpRequest(request, response, resolved) {
    console.log(
        request.connection.remoteAddress + ' - - '
        + request.method + ' '
        + request.url + (resolved?' => '+resolved:'') + ' '
        + 'HTTP/' + request.httpVersion + ' - '
        + response.statusCode + ' '
        + response.statusMessage);
}

/**
 * @param {String} pathname 
 * @returns {String}
 */
function getContentType(pathname) {
    const mimeType = mimeTypes[pathname.substring(pathname.lastIndexOf('.')+1)];
    return mimeType ? mimeType : 'text/plain';
}

/**
 * Lazy way of implementing a ignore system.
 * @param {String} pathname 
 * @returns {String|undefined}
 */
const filterPathname = (pathname) => ignore.find((temp) => pathname.includes(temp));


// Simply hard coded things.
const autoComplete = [ '', 'index.html', '.js' ];
const ignore = [ 'server.js', 'package.json', '.vscode', '.git', '.gitattributes' ];
const mimeTypes = {
    html: 'text/html',
    htm: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
    json: 'application/json',
};

server.listen(port, '0.0.0.0', () => {
    const serverAddress = server.address();
    let address = serverAddress.address;
    if (serverAddress.family === 'IPv6') address = '['+address+']';
    console.log(`Serving http on ${address}:${serverAddress.port} ..`);
});