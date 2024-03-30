import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 4000;

// In-memory data store
let posts = [
  {
    id: 1,
    title: "Mastering AI: A Comprehensive Guide to Building Your Tech Stack",
    content:
      "Mastering AI requires a holistic understanding of its underlying technology stack, as well as a commitment to continuous learning and experimentation. By familiarizing yourself with programming languages, machine learning frameworks, data processing tools, and cloud platforms, you'll be well-equipped to tackle the challenges of building intelligent systems. So, roll up your sleeves, dive into the AI tech stack, and unleash your creativity in the exciting world of artificial intelligence ",
    author: "Alex Thompson",
    date: "2023-08-01T10:00:00Z",
  },
  {
    id: 2,
    title: "Navigating the App Development Landscape: A Comprehensive Guide",
    content:"Mastering app development requires a comprehensive understanding of its underlying technologies and a commitment to continuous learning and experimentation. By familiarizing yourself with programming languages, development tools, UI/UX design principles, back-end services, app distribution platforms, and analytics tools, you'll be well-equipped to tackle the challenges of building successful mobile applications. So, roll up your sleeves, dive into the app development tech stack, and unleash your creativity in the exciting world of mobile app development",
        author: "Mia Williams",
    date: "2023-08-05T14:30:00Z",
  },
  {
    id: 3,
    title: "Navigating the Cloud: A Comprehensive Guide to Building Your Tech Stack",
    content:"Embracing the cloud requires a comprehensive understanding of its underlying technologies and a commitment to continuous learning and innovation. By familiarizing yourself with compute services, storage services, database services, networking services, IAM, monitoring tools, and management tools, you'll be well-equipped to build scalable, resilient, and cost-effective solutions in the cloud. So, roll up your sleeves, dive into the cloud tech stack, and unlock the full potential of cloud computing for your organization!",
    author: "Samuel Green",
    date: "2023-08-10T09:15:00Z",
  },
];


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
