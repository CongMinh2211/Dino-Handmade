import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  image: { type: String },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

blogSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

export const Blog = mongoose.model('Blog', blogSchema);
