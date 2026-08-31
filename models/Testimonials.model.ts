import mongoose, { type Model } from 'mongoose';

const TestimonialSchema = new mongoose.Schema(
  {
    quote: { type: String, required: true },
    author: { type: String, default: '' },
    role: { type: String, default: '' },
    projectRef: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Testimonial: Model<any> = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);

export default Testimonial;
