import pug from 'pug';
import express from 'express';
import morgan from 'morgan';
// import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import Explosion from './utils/appError.js';
import globalError from './controller/errorController.js';
import mountRoutes from './routes/index.js';
import { whitelist, limiter } from './utils/helper.js';
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

//Global Middlewares
// app.use(helmet());
app.use('/api', limiter);
app.use(compression());
app.use(mongoSanitize());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(hpp({ whitelist }));
app.use(express.static('./public'));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//Mounts

mountRoutes(app);
// Handle Not Found Routes

app.all('*', (req, res, next) => {
  next(
    new Explosion(`Can Not Found Route ${req.originalUrl} On Our Sever!`, 404)
  );
});

app.use(globalError);
export default app;
