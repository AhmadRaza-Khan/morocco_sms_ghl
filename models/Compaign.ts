import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICompaign extends Document {
  phone: string;
  compaign: string;
  initialSend: boolean;
  reminderSend: boolean;
}

const CompaignSchema: Schema<ICompaign> = new Schema(
  {
    phone: { type: String, required: true },
    compaign: { type: String, required: true },
    initialSend: { type: Boolean, default: false },
    reminderSend: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Compaign: Model<ICompaign> =
  mongoose.models.Compaign ||
  mongoose.model<ICompaign>("Compaign", CompaignSchema);

export default Compaign;