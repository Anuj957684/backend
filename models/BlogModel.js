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
    minlength: [200, "Should caontain atleast 200 characters!"],
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});




const Blog = mongoose.model("Blog", blogSchema);

const createBlog = async(body)=> {
    const newUser = await Blog.create(body);
    return newUser;
}

const getBlogs = async() => {
    
    const blogs =  Blog.find();
    return  blogs;
}




module.exports = {
    Blog,
    createBlog,
    getBlogs
}
