import express from "express";
import cookieParser from "cookie-parser";

import connectToDatabase from "./database/mongodb.js";
import { PORT } from './config/env.js';

import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import apiRouter from "./routes/api.routes.js";

const app = express();

// express have build in middlewares
app.use(express.json());  // this allows our app to handle json data sent in request or API
app.use(express.urlencoded({extended: false})); //this helps us to process the form data sent via html forms in a simple format.
app.use(cookieParser());


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/apis', apiRouter);

app.get('/',(req, res) =>{
    res.send('Welcome to the Subsciption Tracker API!');
});


app.listen(PORT,async () =>  {
    console.log(`Public Holidays Tracker API is running on http://localhost:${PORT}`);

    await connectToDatabase();
});

export default app;