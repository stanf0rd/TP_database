const cluster = require('cluster');
const fastify = require('fastify');
// const morgan  = require('morgan');

const routes = require('./routes');

// const workers = [];


// const setupWorkerProcesses = () => {
//   // to read number of cores on system
//   const numCores = 2;

//   for (let i = 0; i < numCores; i += 1) {
//     workers.push(cluster.fork());

//     // to receive messages from worker process
//     workers[i].on('message', (message) => {
//       console.log(message);
//     });
//   }

//   cluster.on('online', (worker) => {
//     console.log(`Worker ${worker.process.pid} is listening`);
//   });

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
//     console.log('Starting a new worker');
//     cluster.fork();
//     workers.push(cluster.fork());

//     workers[workers.length - 1].on('message', (message) => {
//       console.log(message);
//     });
//   });
// };


// const setUpFastify = () => {
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
// };


// const setupServer = (isClusterRequired) => {
//   if (isClusterRequired && cluster.isMaster) {
//     setupWorkerProcesses();
//   } else setUpFastify();
// };

// setupServer(true);
