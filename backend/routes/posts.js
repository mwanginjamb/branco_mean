const express = require('express');

const multer = require('multer');

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}

//configure multer

const fileStorage = multer.diskStorage({
  destination: (req,file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");

    if(isValid){
      error = null;
    }
    cb(error, 'backend/images');
  },
  filename:(req,file,cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null,name + '-' + Date.now() +'.'+ ext);
  }
});

//Middleware to post/add posts

router.post("", multer({storage: fileStorage}).single("image"), (req,res, next) => {

  const url = req.protocol + '://' + req.get('host'); //path to hosting server
  const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename
  });
  post.save().then(result => {
      res.status(201).json({
          message: "Post Saved Successfully",
          post: {
            ...result,
            id: result._id,

          }
      });
  });
  console.log(post);

});


//Middleware to update posts

router.put("/:id", (req,res,next) => {

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
router.get('',(req,res,next) => {

  Post.find().then(documents => {
       //return our response as json
      res.status(200).json({
          message: 'successfull API response',
          posts: documents,
      });
  });

});


//Middleware to get a particular post based on id

router.get('/:id',(req,res,next) => {
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

router.delete('/:id', (req, res, next) => {

  Post.deleteOne({_id: req.params.id}).then( result => {
      console.log(result);
      res.status(200).json({ message: 'Post Deleted Successfully! '});
  });

});


module.exports = router;
