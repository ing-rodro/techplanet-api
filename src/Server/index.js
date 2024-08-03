import express from 'express';
import cors from 'cors';
import { initializeDB } from './db';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

var allowedOrigins  = ['http://localhost:3000', 'https://techplanet-webapp.vercel.app', 'https://techplanet-webapp.onrender.com']
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

export const app = express();

// creating Server
export const initializeServer = async (routes) => {
  // initialize DB
  await initializeDB();

  app.use(cors(corsOptions));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  // json parse
  app.use(express.json());
  app.use(cookieParser());

  // set urls
  app.use(routes);
};
