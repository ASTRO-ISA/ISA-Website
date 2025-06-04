const Blog = require('../models/blogModel')

exports.allBlogs = async (req, res) => {
    try {
        const allBlogs = await Blog.find({});

        if(!allBlogs) {
            res.status(404).json({message: 'Nothing to see here right now!'});
        }

        res.status(200).json(allBlogs);
    }
    catch (err) {
        res.status(500).json({message: 'Server Error'});
    }
}

exports.createBlog = async (req, res) => {
    try {
        const newBlog = new Blog({
          thumbnail: req.file.filename,
          title: req.body.title,
          description: req.body.description,
          content: req.body.content,
          author: req.user.id
        });
        await newBlog.save();
    
        res.status(201).json({ message: "Blog saved successfully.", blog: newBlog });
    } catch (err) {
        res.status(500).json({ error: "Failed to save blog.", details: err.message });
    }
}

exports.readBlog = async (req, res) => {
    try {
        const {id} = req.params;
        const blog = await Blog.findById(id);

        if(!blog){
            return res.status(404).json({message: 'Blog not found'});
        }
        res.status(200).json(blog);

    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}