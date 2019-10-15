import * as express from 'express';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import baseController from './controllers';
import { Server } from 'socket.io';
import startSocket from './controllers/socket';


createConnection().then(async (connection) => {
  dotenv.config();
  const app = express();
  let server, io;

  app.set('port', process.env.PORT || 3000);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", 'http://localhost:5000');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
  app.use('/', baseController)

  server = app.listen(app.get('port'), () => {
    console.log(('App is running at http://localhost:%d in %s mode'),
      app.get('port'), app.get('env'));
    console.log('Press CTRL-C to stop\n');
  })
  io = require('socket.io').listen(server)
  startSocket(io)
}).catch((error) => console.log(error))