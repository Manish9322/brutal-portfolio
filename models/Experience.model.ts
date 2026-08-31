import mongoose, { type Model } from 'mongoose';

const RelatedProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
  },
  { _id: true }
);

const ExperienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    company: { type: String, default: '' },
    period: { type: String, default: '' },
    description: { type: String, default: '' },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },

    // Detail-page content
    location: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    industry: { type: String, default: '' },
    teamSize: { type: String, default: '' },
    website: { type: String, default: '' },
    technologies: [{ type: String }],
    achievements: [{ type: String }],
    responsibilities: [{ type: String }],
    projects: { type: [RelatedProjectSchema], default: [] },
  },
  { timestamps: true }
);

const Experience: Model<any> =
  mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);

export default Experience;
