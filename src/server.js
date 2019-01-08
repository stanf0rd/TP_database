const fastify = require('fastify');
// const morgan  = require('morgan');

const routes = require('./routes');


const service = fastify();
// service.use(morgan('dev'));
service.addContentTypeParser(
  'application/json',
  { parseAs: 'buffer' },
  (req, body, done) => {
    if (body.length > 0) {
      done(null, JSON.parse(body));
    } else done(null, {});
  },
);

routes.forEach((route) => {
  const { method, url, func } = route;
  service[method](`/api${url}`, func);
});


service.listen(5000, '0.0.0.0');
console.log('Started');
