const express = require('express');

const app = express();

//Define middlewares


//Define middleware to sought out cors issues

app.use((req,res,next)=> {
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.setHeader('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type,Accept");
    res.setHeader('Access-Control-Allow-Methods',"POST,GET,PATCH,DELETE,OPTIONS");
    next();
});


app.use('/api/posts',(req,res,next) => {
    const posts = [
        {
            id: 1,
            title: 'My First post',
            const: 'This is My First Name : Francis'
        },
        {
            id: 2,
            title: 'My Second Post',
            const: 'Checkout the fancy response from Express server'
        }
     ];

     //resturn our response as json
    res.status(200).json({
        message: 'successfull API response',
        posts: posts,
    });
});

//Export the app - the node way

module.exports = app;