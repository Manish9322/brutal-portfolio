import mongoose, { type Model } from 'mongoose';

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: String, default: () => new Date().toISOString() },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Contact: Model<any> = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

export default Contact;
