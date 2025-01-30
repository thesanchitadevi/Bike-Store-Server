// Code for the app
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();

//parse application/json
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// application routes
app.use('/api', router);

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
