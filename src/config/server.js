import path from 'path';
import fs from 'fs';

export function requestHandler (req, res) {
  const indexPagePath = path.resolve(__dirname + '/..') + '/index.html';
  fs.readFile(indexPagePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}
