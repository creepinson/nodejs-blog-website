var express = require("express");
var app = express();
var http = require('http')

var server = http.Server(app);
var basedir = __dirname + "/public";
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/blog");

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname+'/public/');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

var postSchema = new mongoose.Schema({ title: String, content: String});

var Post = mongoose.model('Post', postSchema);

app.get("/blog", (req, res) =>{
    Post.find({}, (err, posts) => {
      res.render('blog/index', { posts: posts})
   });
});

app.get("/blog-admin", (req, res) =>{
  Post.find({}, (err, posts) => {
    res.render('blog/admin', { posts: posts})
 });
});


app.post('/blog/addPost', (req, res) => {
    var postData = new Post(req.body);
    if(req.body.adminpassword == process.env.PASSWORD){
      console.log("Adding Post With Title: " + req.body.title);
      postData.save().then( result => {
        res.redirect("/blog-admin");
      }).catch(err => {
          res.status(400).send("Unable to save data");
      });
    } else {
      res.redirect("/blog");
    }
});

app.post('/blog/removePost', (req, res) => {
  console.log("Removing Post With Title: " + req.body.title);
  Post.find({ title: req.body.title }).remove(result => {
    res.redirect("/blog-admin");
  }).catch(err => {
      res.status(400).send("Unable to save data");
  });
});



var httpPort = 8080;

app.use(express.static(basedir));

server.listen(httpPort, () => {
  console.log("HTTP Server listening on " + httpPort);
});
