import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  character: { type: String },
  size: { type: String },
  colors: { type: String },
  notes: { type: String },
  status: { 
    type: String, 
    enum: ['new', 'in_progress', 'completed', 'cancelled'], 
    default: 'new' 
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

orderSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

export const Order = mongoose.model('Order', orderSchema);
