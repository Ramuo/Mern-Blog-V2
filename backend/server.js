import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from './config/db.js';


 const port = process.env.PORT || 5000;

 //CONNECT DB
 connectDB();

 //INITIALIZE EXPRESS
 const app = express();


 //BODY PARSER MIDDLEWARE


 //ROUTES
 app.get('/', (req, res) => {
   res.send('Server is running...');
});


//STATIC ROUTE

//MIDDLEWARE


 app.listen(port, () => console.log(`Server is on port ${port}`));