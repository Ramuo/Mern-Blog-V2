import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
dotenv.config();
import connectDB from './config/db.js';
import {notFound, errorHandler} from "./middlewares/errorMiddleware.js";


import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js"


 const port = process.env.PORT || 5000;

 //CONNECT DB
 connectDB();

//INITIALIZE EXPRESS
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cookie parsr middleware
app.use(cookieParser());


 //ROUTES
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);


//STATIC ROUTE
app.get('/', (req, res) => {
  res.send('Server is running...');
});

//MIDDLEWARE
app.use(notFound);
app.use(errorHandler);


 app.listen(port, () => console.log(`Server is on port ${port}`));