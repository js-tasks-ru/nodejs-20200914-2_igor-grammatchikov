const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('статус код ответа 400');
    return;
  }

  switch (req.method) {
    case 'GET':
      const readStream = fs.createReadStream(filepath);
      readStream.pipe(res);
      readStream.on('error', (err) => {
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('Файл не найден');
        } else {
          res.statusCode = 500;
          res.end('Ошибка сервера');
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
