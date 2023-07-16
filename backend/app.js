const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/index');
const errorMiddlewares = require('./middlewares/errors');
// eslint-disable-next-line import/order
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 4000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('db connected');
});

app.use(bodyParser.json());

const allowedCors = [
  'https://sergey.nomoredomains.xyz',
  'http://sergey.nomoredomains.xyz',
  'https://sergeyback.nomoredomains.xyz',
  'http://sergeyback.nomoredomains.xyz',
];

// eslint-disable-next-line consistent-return
app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  next();
});

//app.use(cors());
app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(routes);
app.use(errorLogger);
app.use(errors());

app.use(errorMiddlewares);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
