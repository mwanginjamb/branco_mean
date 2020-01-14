const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');

const path = require('path'); //allows for proper path construction

const app = express();

//make mongo db connection

mongoose.connect("mongodb+srv://francois:XPCRpknA3gZMnxhD@cluster0-okgah.mongodb.net/branco?retryWrites=true&w=majority",
 { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Connected to db successfully');
})
.catch((err) => {
     console.log('Error connecting to mongo cloud: '+ err);
});

//Define middlewares

//define a middeware to parse request bodies

app.use(bodyParser.json());

//make the images folder accessible

app.use('/images', express.static(path.join("backend/images")));

//to parse url data use

app.use(bodyParser.urlencoded({ extended: false }));

//Define middleware to sought out cors issues

app.use((req,res,next)=> {
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.setHeader('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type,Accept");
    res.setHeader('Access-Control-Allow-Methods',"POST,GET,PATCH,PUT,DELETE,OPTIONS");
    next();
});

//make express aware of posts routes

app.use('/api/posts',postsRoutes);

//Export the app - the node way

module.exports = app;
