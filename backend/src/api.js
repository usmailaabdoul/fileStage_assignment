const express = require('express');
const cors = require('cors');

const routes = require('./routes');

function requestLogger(req, res, next) {
  res.once('finish', () => {
    const log = [req.method, req.path];
    if (req.body && Object.keys(req.body).length > 0) {
      log.push(JSON.stringify(req.body));
    }
    if (req.query && Object.keys(req.query).length > 0) {
      log.push(JSON.stringify(req.query));
    }
    log.push('->', res.statusCode);
    // eslint-disable-next-line no-console
    console.log(log.join(' '));
  });
  next();
}

const app = express();

app.use(requestLogger);
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', routes);

module.exports = app;
