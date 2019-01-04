const fastify = require('fastify');
const morgan  = require('morgan');

const routes = require('./routes');


const service = fastify();
service.use(morgan('dev'));


routes.forEach((route) => {
  const { method, url, func } = route;
  service[method](`/api${url}`, func);
});


service.listen(5000);
