import mongoose, { type Model } from 'mongoose';

const EducationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true },
    institution: { type: String, default: '' },
    year: { type: String, default: '' },
    description: { type: String, default: '' },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },

    // Timeline / certificate detail
    type: { type: String, enum: ['degree', 'certification', 'course'], default: 'degree' },
    field: { type: String, default: '' },
    period: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    location: { type: String, default: '' },
    gpa: { type: String, default: '' },
    achievements: [{ type: String }],
    website: { type: String, default: '' },
    certificateUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

const Education: Model<any> = mongoose.models.Education || mongoose.model('Education', EducationSchema);

export default Education;
