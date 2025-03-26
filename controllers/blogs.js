
const { Blog, createBlog, getBlogs } = require("../models/BlogModel");
const { validateBlog } = require("../utilis/validation"); 
const { getBaseUrl } = require("../utilis/helper");
const mongoose = require("mongoose");

const handleCreateBlog = async (req, res) => {
  const body = req.body;

  if (!validateBlog(body)) {
    return res.status(400).json({ message: "Fill required fields" });
  }

  if (req.file) {  
    const baseUrl = getBaseUrl();
    body.blogImage = `${baseUrl}/uploads/${req.file.filename}`;
  } else if (body.blogImageUrl) { 
    body.blogImage = body.blogImageUrl;
  } else{
    return res.status(400).json({ message: "Blog image is required" });
  }

  try {
    body.user = req.user._id; 
    const newBlog = await createBlog(body);

    const populatedBlog = await Blog.findById(newBlog._id).populate("user", "name email");

    return res.status(201).json({ message: "Blog created", data: populatedBlog });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const handleGetAllBlogs = async (req, res) => {
  try {
    const blogs = await getBlogs();
    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found" });
    }

    const blogData = blogs.map((blog) => {
      const blogObject = blog.toObject(); 
      delete blogObject.__v; 
      if (blogObject.blogImage && !blogObject.blogImage.startsWith("http")) {
        blogObject.blogImage = `${getBaseUrl()}/${blogObject.blogImage}`; 
      }
      return blogObject;
    });

    return res.status(200).json({ message: "Blogs retrieved", data: blogData });
  } catch (err) {
    console.error("Error getting blogs:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const handleDeleteBlog = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid blog ID" });
  }

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.status(200).json({ message: "Blog deleted", data: deletedBlog });
  } catch (err) {
    console.error("Error deleting blog:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const handleUpdateBlog = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid blog ID" });
  }

  try {
    if (req.file) {
      const baseUrl = getBaseUrl();
      body.blogImage = `${baseUrl}/uploads/${req.file.filename}`;
    } else if (body.blogImageUrl) {
      body.blogImage = body.blogImageUrl;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.status(200).json({ message: "Blog updated", data: updatedBlog });
  } catch (err) {
    console.error("Error updating blog:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const handleGetBlogById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid blog ID" });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const blogData = blog.toObject();
    delete blogData.__v;
    if (blogData.blogImage && !blogData.blogImage.startsWith('http')) {
      blogData.blogImage = `${getBaseUrl()}/${blogData.blogImage}`;
    }
    return res.status(200).json({ message: "Blog retrieved", data: blogData });
  } catch (err) {
    console.error("Error getting blog by ID:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  handleCreateBlog,
  handleGetAllBlogs,
  handleDeleteBlog,
  handleUpdateBlog,
  handleGetBlogById,
};