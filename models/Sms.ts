import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ISms extends Document {
  sender_id: string;
  tags: string;
  text: string;
  link: string;
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
    link: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default models.Sms || model<ISms>("Sms", SmsSchema);