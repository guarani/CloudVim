var connect = require('connect');
var url = require('url');
connect().use(function middleware1(req, res, next) {
    var url_parts = url.parse(req.url, true);
    console.log(url_parts.query);
    res.end('Thanks for registering with CloudVim');
}).listen(8080);
