import mongoose, { type Model } from 'mongoose';

const GallerySchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    caption: { type: String, default: '' },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },

    // Grouping for the /gallery page
    category: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

const Gallery: Model<any> = mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);

export default Gallery;
