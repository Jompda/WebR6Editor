const { resolveFile, getContentType, logHttpRequest, starMatcher } = require('./server');
const http = require('http'), fs = require('fs');

/**@type {http.ServerResponse[]} */
const clients = [];

/**@type {NodeJS.Timeout|undefined} */
var refresh;

/**
 * TODO: If a file is deleted or added, remap the directories (remember unwatch).
 * @param {String} rootDirectory 
 * @param {String[]} ignoreList 
 */
function mapDirectories(rootDirectory, ignoreList) {
    const directories = [];
    handleDirectory(rootDirectory);
    directories.forEach((directory) => {
        fs.watch(directory, (event, filename) => handleEvents(event, directory+'/'+filename));
    });

    function handleDirectory(path) {
        directories.push(path);
        fs.readdirSync(path).forEach((file) => {
            const tempFilepath = path + '/' + file;
            if (ignoreList.find((str) => starMatcher(str, tempFilepath.slice(rootDirectory.length+1)))) return;
            if (fs.statSync(tempFilepath).isDirectory()) handleDirectory(tempFilepath);
        })
    }

    function handleEvents(event, filepath) {
        if (ignoreList.find((str) => starMatcher(str, filepath.slice(rootDirectory.length+1)))) return;

        if (refresh) clearTimeout(refresh);
        refresh = setTimeout(refreshClients, 100);
        
        function refreshClients() {
            refresh = undefined;
            clients.forEach((client) => client.write('data:refresh\n\n'));
        }
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