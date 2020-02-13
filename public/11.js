var fs = require('fs');
var http = require ('http');
var server = http.createServer(function(req, res) {
  // В req.url находится текущий адрес страницы
  if (req.url === '/index' || req.url === '/' ) {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    fs.createReadStream(__dirname + '/index.html').pipe(res);
  }
  else if (req.url === '/mailer'  ) {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    fs.createReadStream(__dirname + '/mailer.html').pipe(res);
  }
  else {
    res.writeHead (404, {'Content-Type': 'text/html; charset=utf-8'});
    fs.createReadStream(__dirname + '/404.html').pipe(res);
  }


});

server.listen(3000, '127.0.0.1');
console.log ("Слідкуєм порт 3000");
