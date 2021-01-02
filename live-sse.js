const server = require('./server');
const http = require('http'), fs = require('fs');

/**@type {http.ServerResponse[]} */
const clients = [];

/**
 * @param {String} root 
 * @param {String[]} ignoreList 
 */
function mapDirectories(root, ignoreList) {
    const directories = [];
    handleDirectory(root);
    directories.forEach((directory) => {
        fs.watch(directory, sendEvents);
    });


    function handleDirectory(path) {
        directories.push(path);
        const files = fs.readdirSync(path).filter(
            (temp) => !ignoreList.find((str) => str === temp)
        );
        files.forEach((file) => {
            const tempFilepath = path + '/' + file;
            if (fs.statSync(tempFilepath).isDirectory()) handleDirectory(tempFilepath);
        })
    }

}

function sendEvents() {
    clients.forEach((client) => client.write('data:refresh\n\n'));
}

/**
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function handleSSE(request, response) {
    response.writeHead(200, {'Content-Type': 'text/event-stream'});
    clients.push(response);
    response.on('close', () => {
        response.end();
        clients.splice(clients.indexOf(response), 1);
    });
}

/**
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function injectHtml(request, response) {
    server.resolveFile('./', (resolvedFile) => {
        if (resolvedFile === undefined) {
            response.writeHead(404);
            response.end();
            server.logHttpRequest(request, response);
            return;
        }

        fs.readFile(resolvedFile, (err, data) => {
            response.writeHead(200, {'Content-Type': server.getContentType(resolvedFile)});

            const codeInjection =
                `<script>// Code injected by the live server.\n` +
                `const source = new EventSource('live-server-updates');\n` +
                `source.onmessage = (event) => event.data === 'refresh' ? location.reload() : undefined;</script>`;
            response.write(data.toString() + codeInjection);
            response.end();
            server.logHttpRequest(request, response, resolvedFile);
        });
    });
}

module.exports = {
    mapDirectories,
    handleSSE,
    injectHtml
}