import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  size: { type: String },
  material: { type: String },
  tags: [String],
  inStock: { type: Boolean, default: true },
  isNew: { type: Boolean, default: false },
  isHot: { type: Boolean, default: false },
  hidden: { type: Boolean, default: false },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  suppressReservedKeyWarning: true
});

productSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

export const Product = mongoose.model('Product', productSchema);
