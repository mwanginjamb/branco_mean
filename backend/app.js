const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post');
const mongoose = require('mongoose');

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

//to parse url data use

app.use(bodyParser.urlencoded({ extended: false }));

//Define middleware to sought out cors issues

app.use((req,res,next)=> {
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.setHeader('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type,Accept");
    res.setHeader('Access-Control-Allow-Methods',"POST,GET,PATCH,PUT,DELETE,OPTIONS");
    next();
});


//Middleware to post/add posts

app.post("/api/posts", (req,res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(result => {
        res.status(201).json({
            message: "Post Saved Successfully",
            postID: result._id
        });
    });
    console.log(post);

});


//Middleware to update posts

app.put("/api/posts/:id", (req,res,next) => {

    post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({ _id: req.params.id }, post).then( result => {
        console.log(result);
        res.status(200).json({ message: "Update successful."});
    });
});

//Middleware to get all posts
app.get('/api/posts',(req,res,next) => {

    Post.find().then(documents => {
         //return our response as json
        res.status(200).json({
            message: 'successfull API response',
            posts: documents,
        });
    });

});


//Middleware to get a particular post based on id

app.get('/api/posts/:id',(req,res,next) => {
    const id = req.params.id;
    Post.findById(id).then(post => {
         if(post) {
            res.status(200).json(post);
         }else {
             res.status(404).json({ message: 'Post not found!'});
         }
    });
});

//Middeware to define delete route

app.delete('/api/posts/:id', (req, res, next) => {

    Post.deleteOne({_id: req.params.id}).then( result => {
        console.log(result);
        res.status(200).json({ message: 'Post Deleted Successfully! '});
    });

});

//Export the app - the node way

module.exports = app;
