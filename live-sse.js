const { resolveFile, getContentType, logHttpRequest, starMatcher } = require('./server');
const http = require('http'), fs = require('fs');

/**@type {http.ServerResponse[]} */
const clients = [];

/**
 * TODO: If a file is deleted or added, remap the directories (remember unwatch).
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
            (temp) => !ignoreList.find((str) => starMatcher(str, temp))
        );
        files.forEach((file) => {
            const tempFilepath = path + '/' + file;
            if (fs.statSync(tempFilepath).isDirectory()) handleDirectory(tempFilepath);
        })
    }

    function sendEvents(event, filename) {
        if (!ignoreList.find((str) => starMatcher(str, filename)))
            clients.forEach((client) => client.write('data:refresh\n\n'));
    }

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
    resolveFile('./', (resolvedFile) => {
        if (resolvedFile === undefined) {
            response.writeHead(404);
            response.end();
            logHttpRequest(request, response);
            return;
        }

        fs.readFile(resolvedFile, (err, data) => {
            if (err) {
                response.writeHead(404);
                response.end();
                return logHttpRequest(request, response);
            }

            response.writeHead(200, {'Content-Type': getContentType(resolvedFile)});

            const content = data.toString();
            const codeInjection =
                `<!-- Code injected by the live server. -->\n` +
                `<script>\nconst sseSrc = new EventSource('live-server-updates');\n` +
                `sseSrc.onmessage = e => e.data == 'refresh' ? location.reload() : 0;\n</script>\n`;

            let pos = content.indexOf('</body>');
            if (pos === -1) pos = content.length;
            const result = content.slice(0, pos) + codeInjection + content.slice(pos);

            response.write(result);
            response.end();
            logHttpRequest(request, response, resolvedFile);
        });
    });
}

module.exports = {
    mapDirectories,
    handleSSE,
    injectHtml
}