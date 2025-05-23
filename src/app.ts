// Code for the app
import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());
//parse application/json
app.use(
  cors({
    origin: [
      'https://bike-store-client-alpha.vercel.app',
      'http://localhost:5173',
    ],
    credentials: true,
  }),
);
app.use(express.json());

// application routes
app.use('/api', router);
app.options('*', cors());

// Default route
const getController = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Bike Store API',
  });
};

app.get('/', getController);

// Error handling
app.use(globalErrorHandler);

// Not found
app.use(notFound);

export default app;
