
// This is not supposed to be a secure server implementation.
const port = 80;
const http = require('http'), url = require('url'), fs = require('fs');

const server = http.createServer(function (request, response) {
    let pathname = url.parse(request.url).pathname.substring(1);
    if(pathname == '') pathname = 'index.html';
    
    //filter GET and HEAD methods
    if(request.method == "GET" || request.method == "HEAD") {
        try {
            const content = fs.readFileSync(pathname);
            response.writeHead(200, {'Content-Type': getContentType(pathname)});
            response.write(content);
            response.end();
        } catch(err) {
            response.writeHead(404);
            response.end();
        }
    }
    else {
        response.writeHead(501);
        response.end();
    }

    //log the HTTP requests
    console.log(
        request.connection.remoteAddress + " - - "
        + request.method + " "
        + request.url + " "
        + "HTTP/" + request.httpVersion + " - "
        + response.statusCode + " "
        + response.statusMessage);
    
});
server.listen(port);
console.log('Serving http on all hostnames on port ' + port + ' ..');

function getContentType(filename) {
    if(filename.endsWith('.html') || filename.endsWith('.htm'))
        return "text/html";
    else if(filename.endsWith('.js'))
        return "text/javascript";
    else if(filename.endsWith('.json'))
        return "application/json";
    else if(filename.endsWith('.css'))
        return "text/css";
    else
        return "text/plain";
}
