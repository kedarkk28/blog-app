require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const multer  = require('multer')
const cors    = require('cors')
const Blog    = require('./models/Blog')

const app    = express()
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 },          // 10 MB
  fileFilter: (_req, file, cb) => {
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) cb(null, true)
    else cb(new Error('Only JPEG and PNG images are allowed'))
  }
})

// ── Middleware ───────────────────────────────────────────
app.use(cors())
app.use(express.json())

// ── DB ──────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blogdb'
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(e  => { console.error('❌ MongoDB error:', e.message); process.exit(1) })

// ── Routes ──────────────────────────────────────────────

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// GET /api/blogs  — list (optional ?category= and ?limit=)
app.get('/api/blogs', async (req, res) => {
  try {
    const filter = {}
    if (req.query.category) filter.category = req.query.category
    const limit = Math.min(parseInt(req.query.limit) || 0, 100)
    const blogs = await Blog
      .find(filter, { 'coverImage.data': 0 })   // keep contentType flag, drop heavy binary
      .sort({ createdAt: -1 })
      .limit(limit)
    res.json(blogs)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// GET /api/blogs/:id  — single post (no image binary)
app.get('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id, { 'coverImage.data': 0 })
    if (!blog) return res.status(404).json({ error: 'Blog not found' })
    res.json(blog)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// GET /api/image/:id  — serve cover image binary
app.get('/api/image/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id, { coverImage: 1 })
    if (!blog?.coverImage?.data) return res.status(404).send('No image')
    res.set('Content-Type', blog.coverImage.contentType)
    res.set('Cache-Control', 'public, max-age=86400')
    res.send(blog.coverImage.data)
  } catch (e) {
    res.status(500).send(e.message)
  }
})

// POST /api/blogs  — create
app.post('/api/blogs', upload.single('coverImage'), async (req, res) => {
  try {
    const { title, category, content, author } = req.body
    const blog = new Blog({ title, category, content, author })
    if (req.file) {
      blog.coverImage = { data: req.file.buffer, contentType: req.file.mimetype }
    }
    await blog.save()
    const result = blog.toObject()
    const hasCover = !!result.coverImage?.data
    delete result.coverImage
    if (hasCover) result.coverImage = { contentType: req.file.mimetype }  // keep flag, drop binary
    res.status(201).json(result)
  } catch (e) {
    const msg = e.name === 'ValidationError'
      ? Object.values(e.errors).map(v => v.message).join(', ')
      : e.message
    res.status(400).json({ error: msg })
  }
})

// DELETE /api/blogs/:id  — delete
app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id)
    if (!blog) return res.status(404).json({ error: 'Blog not found' })
    res.json({ message: 'Deleted successfully' })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Global error handler ─────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

// ── Start ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))