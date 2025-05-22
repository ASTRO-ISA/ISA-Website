const mongoose = require('mongoose');
const blogSchema = require("../schema/blogSchema.js");

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;