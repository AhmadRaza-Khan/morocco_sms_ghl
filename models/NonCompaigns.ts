import mongoose, { Schema, Document, Model } from "mongoose";

export interface INonCompaign extends Document {
  phone: string;
  compaign: string;
  send: boolean;
}

const NonCompaignSchema: Schema<INonCompaign> = new Schema(
  {
    phone: { type: String, required: true },
    compaign: { type: String, required: true },
    send: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const NonCompaign: Model<INonCompaign> =
  mongoose.models.Compaign ||
  mongoose.model<INonCompaign>("NonCompaign", NonCompaignSchema);

export default NonCompaign;