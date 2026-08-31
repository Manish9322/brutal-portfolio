import mongoose, { type Model } from 'mongoose';

const AboutSchema = new mongoose.Schema(
  {
    manifestoHeading: { type: String, default: 'THE MANIFESTO' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

const About: Model<any> = mongoose.models.About || mongoose.model('About', AboutSchema);

export default About;
