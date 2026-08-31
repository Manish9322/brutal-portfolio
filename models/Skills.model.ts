import mongoose, { type Model } from 'mongoose';

const SkillSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    items: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Skill: Model<any> = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);

export default Skill;
