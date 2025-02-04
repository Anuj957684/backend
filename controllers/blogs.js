const { Blog, createBlog, getBlogs } = require("../models/BlogModel");
const { validateBlog } = require("../utilis/validation");
const { getBaseUrl } = require("../utilis/helper");
const mongoose = require("mongoose");

const handleCreateBlog = async (req, res) => {
  const body = req.body;

  // Validate required fields
  if (!validateBlog(body)) {
    return res.status(400).json({ status: 400, message: "Fill required fields" });
  }

  // If an image is uploaded via file (optional)
  const photo = req.file;
  if (photo) {
    const baseUrl = getBaseUrl();
    body.blogImage = `${baseUrl}/uploads/${photo.filename}`;
  }

  // If an image URL is provided in the request body
  if (body.blogImageUrl) {
    const baseUrl = getBaseUrl();
    body.blogImage = `${baseUrl}/uploads/${blogImageUrl.filename}`; // Use the URL provided by the user
  }

  try {
    const newBlog = await createBlog(body);

    if (!newBlog) {
      return res.status(400).json({ status: 400, message: "Error occurred while creating the blog" });
    }

    return res.status(200).json({
      status: 200,
      message: "Blog created successfully",
      data: newBlog,
    });
  } catch (err) {
    return res.status(500).json({ status: 500, message: "Internal server error", err: err.message });
  }
};

const handleGetAllBlogs = async (req, res) => {
  try {
    const blogs = await getBlogs();

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ status: 404, message: "No blogs found." });
    }

    const blogData = blogs.map((blog) => {
      const d = blog.toObject();
      delete d.__v;

      if (d.blogImage) {
        d.blogImage = `${baseURL}/uploads/${d.blogImage}`;
      }

      return d;
    });

    return res.status(200).json({ status: 200, message: "Blogs retrieved successfully", data: blogData });
  } catch (err) {
    return res.status(500).json({ status: 500, message: "Internal server error", err: err.message });
  }
};

const handleDeleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ status: 404, message: "Blog not found or already deleted." });
    }

    return res.status(200).json({ status: 200, message: "Blog deleted successfully", data: deletedBlog });
  } catch (err) {
    return res.status(500).json({ status: 500, message: "Internal server error", err: err.message });
  }
};

const handleUpdateBlog = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ status: 400, message: "Invalid ID format" });
  }

  try {
    // If a new image file is uploaded, store its URL
    if (req.file) {
      const photo = req.file;
      body.blogImage = `${getBaseUrl()}/uploads/${photo.filename}`;
    }

    // If an image URL is provided, use that URL
    if (body.blogImageUrl) {
      body.blogImage = body.blogImageUrl; // Store the URL provided by the user
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (!updatedBlog) {
      return res.status(404).json({ status: 404, message: "Blog not found or unable to update" });
    }

    return res.status(200).json({
      status: 200,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (err) {
    return res.status(500).json({ status: 500, message: "Internal server error", err: err.message });
  }
};

const handleGetBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ status: 404, message: "Blog not found." });
    }

    const blogData = blog.toObject();
    if (blogData.blogImage && !blogData.blogImage.startsWith("http")) {
      blogData.blogImage = `${getBaseUrl()}/${blogData.blogImage}`;
    }

    return res.status(200).json({ status: 200, message: "Blog retrieved successfully", data: blogData });
  } catch (err) {
    return res.status(500).json({ status: 500, message: "Internal server error", err: err.message });
  }
};

module.exports = {
  handleCreateBlog,
  handleGetAllBlogs,
  handleDeleteBlog,
  handleUpdateBlog,
  handleGetBlogById,
};
