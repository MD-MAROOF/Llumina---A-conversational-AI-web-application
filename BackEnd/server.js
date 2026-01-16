// import OpenAI from 'openai';
// import 'dotenv.config';

// //I have taken the below block of code from npm open ai website
// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
// });

// const response = await client.responses.create({
//   model: 'gpt-4o-mini',
//   input: 'Are semicolons optional in JavaScript?',
// });

// console.log(response.output_text);



import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import allPaths from "./routes/app-paths.js";
import cors from "cors";


const application = express();
const PORT = 5000;

application.use(express.json()); //For parsing incoming requests
application.use(cors());

application.use("/openai", allPaths); //Prepending all paths with /openai

application.listen(PORT, () => {
    console.log(`application will be hosted on ${PORT}`);
    Database_connection();
});

// The below code is to connect with the database. I am making the use of MongoDB 
const Database_connection = async() =>{
    try{
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Connection with Database Successful !");
    }

    catch(err)
    {
        console.log("Connection with Database unsuccessful",err);
    }
}

