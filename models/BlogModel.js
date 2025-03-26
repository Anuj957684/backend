const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  blogImage: {
    type: String,
    required: true,  
  },
  category: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
   
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });




const Blog = mongoose.model("Blog", blogSchema);

const createBlog = async(body)=> {
    const newUser = await Blog.create(body);
    return newUser;
}

const getBlogs = async () => {
  return await Blog.find().populate("user", "name email");
  return Blog;
};




module.exports = {
    Blog,
    createBlog,
    getBlogs
}
