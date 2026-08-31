import mongoose, { type Model } from 'mongoose';

const SEOSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    keywords: { type: [String], default: [] },
    ogImage: { type: String, default: '' },
  },
  { timestamps: true }
);

const SEO: Model<any> = mongoose.models.SEO || mongoose.model('SEO', SEOSchema);

export default SEO;
