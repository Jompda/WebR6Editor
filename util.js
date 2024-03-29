
const http = require('http'), fs = require('fs')

/**
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function finishResponse({ statusCode = 200, headers, message, resolved }, request, response, ) {
	response.writeHead(statusCode, headers).end(message)
	logHttpRequest(request, response, resolved)
}

/**
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 * @param {String=} resolved 
 */
function logHttpRequest(request, response, resolved) {
	console.log(
		request.connection.remoteAddress + ' - - '
		+ request.method + ' '
		+ request.url + (resolved?' => '+resolved:'') + ' '
		+ 'HTTP/' + request.httpVersion + ' - '
		+ response.statusCode + ' '
		+ response.statusMessage)
}

/**
 * @param {Object} obj 
 * @param {String} filepath 
 */
function cfgToObject(obj, filepath) {
	fileToLineArray(filepath).filter((line)=>!line.match(/(#.*)|(\[.*])/)).forEach((line) => {
		const parts = line.split('=') // Filter out bad lines.
		return parts.length !== 2 ? 0 : obj[parts[0]] = parts[1]
	});
}

/**
 * @param {String} filepath 
 * @returns {String[]}
 */
function fileToLineArray(filepath) {
	return fs.readFileSync(filepath).toString().split(/\r?\n/)
}

/**
 * @param {String} matcher 
 * @param {String} str 
 * @returns {Boolean}
 */
function starMatcher(matcher, str) {
	let mpos = 0, a, b
	for (let i = 0; i < str.length; i++) {
		const mn = matcher[mpos+1], sn = str[i+1]
		if (sn === undefined && mn === '*') return true
		if ((a = matcher[mpos]) === (b = str[i])) {
			mpos++; continue
		}
		if (a !== '*') return false
		mn === b ? mpos++ && i-- :
		mn === sn ? mpos++ : 0
	}
	return mpos >= matcher.length
}

module.exports = {
	finishResponse,
	logHttpRequest,
	cfgToObject,
	fileToLineArray,
	starMatcher
}
