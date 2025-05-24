const express = require('express');
const path = require('path');
const Blog = require('../models/blogModel');
const router = express.Router();

router.get('/blogs/:id', async (req, res) => {
    console.log('got request to read blog');
    try {
        const {id} = req.params;
        const blog = await Blog.findById(id);

        if(!blog){
            return res.status(404).json({message: 'Blog not found'});
        }

        res.status(200).json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
});

module.exports = router;