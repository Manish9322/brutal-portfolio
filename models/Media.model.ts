import mongoose, { type Model } from 'mongoose';

const MediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    label: { type: String, default: '' },
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    dateAdded: { type: String, default: () => new Date().toISOString().split('T')[0] },
  },
  { timestamps: true }
);

const Media: Model<any> = mongoose.models.Media || mongoose.model('Media', MediaSchema);

export default Media;
