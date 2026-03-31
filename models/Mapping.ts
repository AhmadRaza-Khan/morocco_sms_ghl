import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMapping extends Document {
  tags: string;
  compaign: string;
  createdAt: Date;
  updatedAt: Date;
}

const MappingSchema = new Schema<IMapping>(
  {
    tags: {
      type: String,
      required: true,
      trim: true,
    },
    compaign: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Mapping: Model<IMapping> =
  mongoose.models.Mapping ||
  mongoose.model<IMapping>("Mapping", MappingSchema);

export default Mapping;