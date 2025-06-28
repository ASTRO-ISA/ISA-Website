const axios = require('axios')

let cache = {
  launches: null,
  blogs: null,
  articles: null
}

let timestamps = {
  launches: null,
  blogs: null,
  articles: null
}

const fetchLaunches = async () => {
  try {
    const res = await axios.get('https://lldev.thespacedevs.com/2.3.0/launches/upcoming/')
    cache.launches = res.data.results
    timestamps.launches = new Date()
    // console.log('launches cache updated')
  } catch (err) {
    console.error('failed to fetch launches:', err.message)
  }
}

const fetchBlogs = async () => {
  try {
    const res = await axios.get('https://api.spaceflightnewsapi.net/v4/blogs')
    cache.blogs = res.data.results
    timestamps.blogs = new Date()
    // console.log('blogs cache updated')
  } catch (err) {
    console.error('failed to fetch blogs:', err.message)
  }
}

const fetchArticles = async () => {
  try {
    const res = await axios.get('https://api.spaceflightnewsapi.net/v4/articles')
    cache.articles = res.data.results
    timestamps.articles = new Date()
    // console.log('articles cache updated')
  } catch (err) {
    console.error('failed to fetch articles:', err.message)
  }
};

// run at sever start
fetchLaunches()
fetchBlogs()
fetchArticles()

// auto refresh every 10 minutes
setInterval(fetchLaunches, 10 * 60 * 1000)
setInterval(fetchBlogs, 10 * 60 * 1000)
setInterval(fetchArticles, 10 * 60 * 1000)

module.exports = {
  getLaunches: () => cache.launches,
  getBlogs: () => cache.blogs,
  getArticles: () => cache.articles,
  timestamps
}