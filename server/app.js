import { config } from 'dotenv';
import * as path from 'path';
import compression from 'compression';
import favicon from 'serve-favicon';
import bodyparser from 'body-parser';
import * as mongoose from 'mongoose';
import * as expressHandlebars from 'express-handlebars';
import helmet from 'helmet';
import session from 'express-session';
import RedisStore from 'connect-redis';
import * as redis from 'redis';
import express from 'express';
import { fileURLToPath } from 'url';
import router from './router.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

config();

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/Witter';
mongoose.connect(dbURI).catch((err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

const redisClient = redis.createClient({
  url: process.env.REDISCLOUD_URL,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient.connect().then(() => {
  const app = express();

  app.use(helmet());
  app.use(helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data: blob:"],
      "connect-src": ["'self'", "https: data: blob:"],
    },
  }))
  app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted`)));
  app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
  app.use(compression());
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json({ limit: '50mb' }));

  app.use(session({
    key: 'sessionId',
    store: new RedisStore({
      client: redisClient,
    }),
    secret: 'どもうありがとう',
    resave: false,
    saveUninitialized: false,
  }));

  app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
  app.set('view engine', 'handlebars');
  app.set('views', `${__dirname}/../views`);

  router(app);

  app.listen(port, (err) => {
    if (err) throw err;
    console.log(__dirname);

    console.log(`listening on port ${port}`);
  });
});
