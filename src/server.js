const restana = require('restana');
const morgan  = require('morgan');

const service = restana();
service.use(morgan('dev'));


console.log(`Worker ${process.pid} started...`);

service.get('/hi', (req, res) => {
  res.send('Hello World!');
});

service.start(5000);
