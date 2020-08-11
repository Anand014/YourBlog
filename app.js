const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { find } = require("lodash");

const homeStartingContent = "Welcome to the YourBlog. You can save your Day in my Website. There is two Section - Title & Content. You can save Your post by clicking on compose button or simply going to /compose route. There is a Read More link where You can read full content on a seprate page. Thanks for Visiting.";
const aboutContent = "Hello EveryOne, I'm a Web Developer. But this is not me, it's my profession. Then Who am I. It's a Good question but in reality, I really don't know myself but I can assure you that I'm a good learner and best partner for my love ones.";
const contactContent = "Here You will find different platforms link where I sleep, All Day Long. HAhaHAha";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Anand:12345@yourblogdb.lhdpi.mongodb.net/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.post ("/delete", function(req, res){

  const name = req.body.button;

  Post.findOneAndDelete({ title : name }, function (err) {
    if (err){
      console.log(err);
    } else {
      console.log("Successfully deleted the post")
    }
    res.redirect("/");
  });
});


app.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log("The server has started at port 3000.");
});