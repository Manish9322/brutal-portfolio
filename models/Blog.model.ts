import mongoose, { type Model } from 'mongoose';

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String, default: '' },
    date: { type: String, default: '' },
    content: { type: String, default: '' },
    published: { type: Boolean, default: false },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Blog: Model<any> = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

export default Blog;
