const { Blog, createBlog, getBlogs } = require("../models/BlogModel");
const { validateBlog } = require("../utilis/validation");
const { getBaseUrl } = require("../utilis/helper");
const mongoose = require("mongoose");

const handleCreateBlog = async (req, res) => {
  const body = req.body;

  if (!validateBlog(body)) {
    return res.status(400).json({ message: "Fill required fields" });
  }

  const photo = req.file;
  if (photo) {
    const baseUrl = getBaseUrl();
    body.blogImage = `${baseUrl}/uploads/${photo.filename}`;
  }

  if (body.blogImageUrl) {
    body.blogImage = body.blogImageUrl;
  }

  try {
    const newBlog = await createBlog(body);
    if (!newBlog) {
      return res.status(400).json({ message: "Error occurred while creating the blog" });
    }
    return res.status(200).json({ message: "Blog created successfully", data: newBlog });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

const handleGetAllBlogs = async (req, res) => {
  try {
    const blogs = await getBlogs();
    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found." });
    }
    const blogData = blogs.map((blog) => {
      const d = blog.toObject();
      delete d.__v;
      if (d.blogImage && !d.blogImage.startsWith("http")) {
        d.blogImage = `${getBaseUrl()}/${d.blogImage}`;
      }
      return d;
    });
    return res.status(200).json({ message: "Blogs retrieved successfully", data: blogData });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

const handleDeleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found or already deleted." });
    }
    return res.status(200).json({ message: "Blog deleted successfully", data: deletedBlog });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

const handleUpdateBlog = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  try {
    if (req.file) {
      const photo = req.file;
      body.blogImage = `${getBaseUrl()}/uploads/${photo.filename}`;
    }
    if (body.blogImageUrl) {
      body.blogImage = body.blogImageUrl;
    }
    const updatedBlog = await Blog.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found or unable to update" });
    }
    return res.status(200).json({ message: "Blog updated successfully", data: updatedBlog });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

const handleGetBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }
    const blogData = blog.toObject();
    if (blogData.blogImage && !blogData.blogImage.startsWith('http')) {
      blogData.blogImage = `${getBaseUrl()}/uploads/${blogData.blogImage}`;
    }
    return res.status(200).json({ message: "Blog retrieved successfully", data: blogData });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

module.exports = {
  handleCreateBlog,
  handleGetAllBlogs,
  handleDeleteBlog,
  handleUpdateBlog,
  handleGetBlogById,
};
