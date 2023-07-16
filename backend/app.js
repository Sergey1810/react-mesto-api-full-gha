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
const corsOptions = {
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
};
app.use(cors(corsOptions));
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
