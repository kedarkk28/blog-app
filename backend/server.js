require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const cors = require('cors')
const Blog = require('./models/Blog')

const app = express()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/blogdb')
  .then(() => console.log('MongoDB connected'))
  .catch(e => console.error('MongoDB error:', e))

// Get all blogs (with optional category filter + limit)
app.get('/api/blogs', async (req, res) => {
  try {
    const filter = {}
    if (req.query.category) filter.category = req.query.category
    const limit = parseInt(req.query.limit) || 0
    const blogs = await Blog.find(filter, { 'coverImage': 0 }).sort({ createdAt: -1 }).limit(limit)
    res.json(blogs)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// Get single blog
app.get('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id, { 'coverImage': 0 })
    if (!blog) return res.status(404).json({ error: 'Not found' })
    res.json(blog)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// Get blog cover image
app.get('/api/image/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id, { coverImage: 1 })
    if (!blog?.coverImage?.data) return res.status(404).send('No image')
    res.set('Content-Type', blog.coverImage.contentType)
    res.send(blog.coverImage.data)
  } catch (e) { res.status(500).send(e.message) }
})

// Create blog
app.post('/api/blogs', upload.single('coverImage'), async (req, res) => {
  try {
    const { title, category, content, author } = req.body
    const blog = new Blog({ title, category, content, author })
    if (req.file) {
      blog.coverImage = { data: req.file.buffer, contentType: req.file.mimetype }
    }
    await blog.save()
    const result = blog.toObject(); delete result.coverImage
    res.status(201).json(result)
  } catch (e) { res.status(400).json({ error: e.message }) }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))



app.get("/api/health", (req,res)=>{
  res.send("Blog backend running")
})