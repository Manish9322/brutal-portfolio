import mongoose, { type Model } from 'mongoose';

const SocialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, default: '' },
  },
  { _id: true }
);

const ProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, default: '' },
    manifestoLine: { type: String, default: '' },
    status: { type: String, default: '' },
    location: { type: String, default: '' },
    discipline: { type: String, default: '' },
    email: { type: String, default: '' },
    telegram: { type: String, default: '' },
    telegramVisible: { type: Boolean, default: true },
    socialLinks: { type: [SocialLinkSchema], default: [] },
  },
  { timestamps: true }
);

const Profile: Model<any> = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);

export default Profile;
