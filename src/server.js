const restana = require('restana');
const parser  = require('body-parser');
const morgan  = require('morgan');

const routes = require('./routes');

const service = restana();
service.use(parser.json());
service.use(morgan('dev'));


console.log(`Worker ${process.pid} started...`);


routes.forEach((route) => {
  const { method, url, func } = route;
  service[method](url, func);
});

service.start(5000);
