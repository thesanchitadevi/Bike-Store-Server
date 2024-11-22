// Code for the app
import express, { Application, Request, Response } from "express";
import cors from "cors";

const app: Application = express();

//parse application/json
app.use(express.json());
app.use(cors());

// application routes
app.use("/api/");

const getController = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Bike Store API",
  });
};

app.get("/", getController);

export default app;
