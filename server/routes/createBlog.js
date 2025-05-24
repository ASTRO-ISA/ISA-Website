const express = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require('../models/blogModel');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.post("/", upload.single("thumbnail"), async (req, res) => {
  console.log('recieved request to create blog');
  try {
    const { title, content, auther, description } = req.body;
    const thumbnail = req.file.filename;

    const newBlog = new Blog({ title, content, thumbnail, auther, description });
    await newBlog.save();

    res.status(201).json({ message: "Blog saved successfully", blog: newBlog });
  } catch (err) {
    res.status(500).json({ error: "Failed to save blog" });
  }
});

module.exports = router;