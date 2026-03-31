import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISms extends Document {
  sender_id: string;
  tags: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const SmsSchema = new Schema<ISms>(
  {
    sender_id: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Sms: Model<ISms> =
  mongoose.models.Sms ||
  mongoose.model<ISms>("Sms", SmsSchema);

export default Sms;