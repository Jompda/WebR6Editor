
const http = require('http'), fs = require('fs')
const { settings } = require('..')
const { resolveFile, getContentType } = require('../server')
const { logHttpRequest } = require('../util')

/**@type {http.ServerResponse[]} */
const clients = []

/**@type {NodeJS.Timeout|undefined} */
var refresh

mapDirectories()

/**
 * @param {http.IncomingMessage} request 
 * @returns {boolean}
 */
function condition(request) {
	return request.method === 'GET' && (request.url.startsWith('/live-page')
		|| request.url.startsWith('/live-server-updates'))
}

/**
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function handle(request, response) {
	if (request.url.startsWith('/live-page')) injectHtml(request, response)
	else handleSSE(request, response)
}

/**
 * TODO: If a file is deleted or added, remap the directories (remember unwatch).
 */
function mapDirectories() {
	const directories = []
	handleDirectory(settings.rootDir)
	directories.forEach((directory) => {
		fs.watch(directory, (event, filename) => handleEvents(event, directory+'/'+filename))
	});

	function handleDirectory(path) {
		directories.push(path)
		fs.readdirSync(path).forEach((file) => {
			const tempFilepath = path + '/' + file
			if (fs.statSync(tempFilepath).isDirectory()) handleDirectory(tempFilepath)
		})
	}

	function handleEvents(event, filepath) {
		if (refresh) clearTimeout(refresh)
		refresh = setTimeout(refreshClients, 100)
		
		function refreshClients() {
			refresh = undefined
			clients.forEach((client) => client.write('data:refresh\n\n'))
		}
	}
}

/**
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function handleSSE(request, response) {
	response.writeHead(200, {'Content-Type': 'text/event-stream'})
	clients.push(response)
	response.on('close', () => {
		response.end()
		clients.splice(clients.indexOf(response), 1)
	});
}

/**
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function injectHtml(request, response) {
	resolveFile(settings.rootDir, (resolvedFile) => {
		if (resolvedFile === undefined) 
			return finishResponse({ statusCode: 404 }, request, response)

		fs.readFile(resolvedFile, (err, data) => {
			if (err) return finishResponse({ statusCode: 404 }, request, response)

			response.writeHead(200, {'Content-Type': getContentType(resolvedFile)})

			const content = data.toString()
			const codeInjection =
				`<!-- Code injected by the live server. -->\n` +
				`<script>\nconst sseSrc = new EventSource('live-server-updates');\n` +
				`sseSrc.onmessage = e => e.data == 'refresh' ? location.reload() : 0;\n</script>\n`

			let pos = content.indexOf('</body>')
			if (pos === -1) pos = content.length
			const result = content.slice(0, pos) + codeInjection + content.slice(pos)

			response.write(result)
			response.end()
			logHttpRequest(request, response, resolvedFile)
		});
	});
}

module.exports = {
	condition,
	handle
}
