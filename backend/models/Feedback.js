import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  image: { type: String },
  avatar: { type: String },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

feedbackSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

export const Feedback = mongoose.model('Feedback', feedbackSchema);
