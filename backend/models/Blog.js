const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ['Travel','Food','Health & Fitness','Lifestyle','Business','Technology'] },
  content: { type: String, required: true },
  author: { type: String, required: true, trim: true },
  coverImage: { data: Buffer, contentType: String }
}, { timestamps: true })

module.exports = mongoose.model('Blog', blogSchema)