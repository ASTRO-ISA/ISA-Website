const BlogSuggestion = require('../models/blogSuggestion')

// to validate the social link provided
function validateSocialMediaUrl(url) {
  try {
    const parsed = new URL(url);

    // only allow http/https
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { valid: false, reason: "Only http/https links are allowed." };
    }

    // extract hostname
    const hostname = parsed.hostname.toLowerCase();

    // allow only specific domains
    const allowedDomains = [
      "facebook.com",
      "instagram.com",
      "twitter.com",
      "x.com",
      "linkedin.com",
      'github.com'
    ];

    if (!allowedDomains.some(d => hostname.endsWith(d))) {
      return { valid: false, reason: "Only social media links are allowed." };
    }

    return { valid: true };
  } catch (err) {
    return { valid: false, reason: "Invalid URL format." };
  }
}

exports.getAllBlogSuggestions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const response = await BlogSuggestion.find(filter).populate('submittedBy', 'name email');
    res.status(200).json({ status: 'success', data: response });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
};

exports.pendingBlogSuggestions = async (req, res) => {
  try{
    const blogs = await BlogSuggestion.find({status: 'pending'}).sort({createdAt: -1}).populate('submittedBy', 'name email')
    if(blogs.length === 0){
      return res.status(404).json({message: 'No suggestions for blogs.'})
    }
    res.status(200).json(blogs)
  } catch (err) {
    res.status(500).json({message: 'Server error getting pending blogs.', err})
  }
}

exports.approvedBlogSuggestions = async (req, res) => {
  try{
    const blogs = await BlogSuggestion.find({status: 'approved'}).sort({createdAt: -1}).populate('submittedBy', 'name email')
    if(blogs.length === 0){
      return res.status(404).json({message: 'No suggestions for blogs.'})
    }
    res.status(200).json(blogs)
  } catch (err) {
    res.status(500).json({message: 'Server error getting pending blogs.', err})
  }
}

exports.postSuggestedBlog = async (req, res) => {
  try {
    const { title, description, link } = req.body
    if (!title || !description) {
      return res.status(400).json({ status: 'fail', message: 'Title or description not provided' })
    }

    if (link) {
      const validation = validateSocialMediaUrl(link)
      if (!validation.valid) {
        return res.status(400).json({ status: 'fail', message: validation.reason })
      }
    }

    req.body.submittedBy = req.user.id
    const response = await BlogSuggestion.create(req.body)

    res.status(201).json({ status: 'success', data: response })
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message })
  }
}

exports.deleteSuggestedBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await BlogSuggestion.findByIdAndDelete(id);
    if (!response) {
      return res.status(404).json({ status: 'fail', message: 'Suggestion not found' });
    }
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
};

exports.updateSuggestedBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await BlogSuggestion.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    if (!response) {
      return res.status(404).json({ status: 'fail', message: 'Suggestion not found' });
    }
    res.status(200).json({ status: 'success', data: response });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
};
