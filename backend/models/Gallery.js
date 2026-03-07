import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String },
  tags: [{ type: String }],
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

gallerySchema.virtual('id').get(function() {
  return this._id.toHexString();
});

export const Gallery = mongoose.model('Gallery', gallerySchema);
