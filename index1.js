// API building

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 4000;
const db = new pg.Client({
  user:"postgres",
host: "localhost",
database: "permalist" ,
password : "Ms1234$#",
port:5432
})
db.connect();


// In-memory data store
let posts = [];

db.query("SELECT * from blog", (err,res)=>{
  if(err){
    console.error("ERROR executing Query" ,err.stack);
  }
  else{
    posts=res.rows;
    // console.log(res.rows)

  }
  db.end;
  });



let lastId = 3;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// get all posts
app.get("/posts", (req, res) => {
   res.json(posts);
})

// get specified post
app.get("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const blog_api = posts.find((post) =>  post.id === id)

  res.json(blog_api);

})


 
// post the blog
app.post("/posts", (req, res) => {
  const newid = lastId + 1;
  const new_post = {
    id: newid,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: new Date(),

  };
  lastId = newid;
  posts.push(new_post);
  //  console.log(new_post);
  res.json(new_post);
})


// update blog -> patch
app.patch("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id)
  const blog_api = posts.find((post) => post.id === id);

  const updated_blog = {
    id: id,
    title: req.body.title || blog_api.title,
    content: req.body.content || blog_api.content,
    author: req.body.author || blog_api.author,
    date: new Date(),
  };
  const blog_index = posts.findIndex((post) => post.id === id);
  posts[blog_index] = updated_blog;
  res.json(updated_blog);

});

// delete 
app.delete("/posts/:id", (req,res)=>{
  const id = parseInt(req.params.id);
  const findIndex = posts.findIndex((post)=>post.id===id);
if (findIndex > -1){
posts.splice(findIndex,1);
res.sendStatus(200);
} 
else {
  res
  .status(404)
  .json({error:`there is something wrong with the id  ${id}`})
}
})
app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
