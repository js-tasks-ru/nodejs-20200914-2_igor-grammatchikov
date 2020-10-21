const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (fs.existsSync(filepath)) {
    res.statusCode = 409;
    res.end('Файл уже существует');
    return;
  }

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('статус код ответа 400');
    return;
  }

  switch (req.method) {
    case 'POST':
      const limitSizeStream = new LimitSizeStream({limit: 1000000});
      const writeStream = fs.createWriteStream(filepath);

      req.pipe(limitSizeStream).pipe(writeStream);

      writeStream.on('finish', () => {
        res.statusCode = 201;
        res.end('Файл создан');
      });

      limitSizeStream.on('error', () => {
        fs.unlinkSync(filepath);
        res.statusCode = 413;
        res.end('Размер файла превышает 1МБ');
      });
  
      req.on('aborted', () => {
        fs.unlinkSync(filepath);
      });

      break;

    default:
      res.statusCode = 501;
      res.end(`файл ${pathname} должен быть на диске`);
  }
});

module.exports = server;
