import mongoose, { type Model } from 'mongoose';

const FooterResourceSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    url: { type: String, default: '#' },
  },
  { _id: true }
);

const SettingsSchema = new mongoose.Schema(
  {
    version: { type: String, default: '1.0.0' },
    marqueeText: { type: String, default: '' },
    footerResources: { type: [FooterResourceSchema], default: [] },
  },
  { timestamps: true }
);

const Settings: Model<any> = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

export default Settings;
