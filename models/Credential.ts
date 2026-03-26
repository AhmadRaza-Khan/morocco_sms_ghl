import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICredential extends Document {
  locationId: string;
  sub_account: string;
  sub_account_pass: string;
  sender_id: string;
}

const CredentialSchema: Schema<ICredential> = new Schema(
  {
    locationId: { type: String, required: true, unique: true },
    sub_account: { type: String, required: true },
    sub_account_pass: { type: String, required: true },
    sender_id: { type: String, required: true },
  },
  { timestamps: true }
);

const Credential: Model<ICredential> =
  mongoose.models.Credential ||
  mongoose.model<ICredential>("Credential", CredentialSchema);

export default Credential;