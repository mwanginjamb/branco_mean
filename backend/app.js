const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post');
const mongoose = require('mongoose');

const app = express();

//make mongo db connection

mongoose.connect("mongodb+srv://francois:XPCRpknA3gZMnxhD@cluster0-okgah.mongodb.net/branco?retryWrites=true&w=majority", { useNewUrlParser: true })
.then(() => {
    console.log('Connected to db successfully');
})
.catch((err) => {
     console.log('Error connecting to mongo cloud: '+ err);
});

//Define middlewares

//define a middeware to parse request bodies

app.use(bodyParser.json());

//to parse url data use

app.use(bodyParser.urlencoded({ extended: false }));

//Define middleware to sought out cors issues

app.use((req,res,next)=> {
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.setHeader('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type,Accept");
    res.setHeader('Access-Control-Allow-Methods',"POST,GET,PATCH,DELETE,OPTIONS");
    next();
});


//Middleware to post/add posts

app.post("/api/posts", (req,res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save();
    console.log(post);

    res.status(201).json({
        message: "Post Saved Successfully"
    });
});

//Middleware to get posts
app.get('/api/posts',(req,res,next) => {
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