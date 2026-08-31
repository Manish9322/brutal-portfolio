import mongoose, { type Model } from 'mongoose';

const ScreenshotSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    caption: { type: String, default: '' },
  },
  { _id: true }
);

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: '' },
    year: { type: String, default: '' },
    description: { type: String, default: '' },
    techStack: [{ type: String }],
    image: { type: String, default: '' },
    link: { type: String, default: '#' },
    visible: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },

    // Detail-page content
    longDescription: { type: String, default: '' },
    challenges: [{ type: String }],
    solutions: [{ type: String }],
    screenshots: { type: [ScreenshotSchema], default: [] },
    role: { type: String, default: '' },
    team: { type: String, default: '' },
    timeline: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

const Project: Model<any> = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export default Project;
