"use server";

import connectDB from "@/lib/connectDb";
import Credential from "@/models/Credential";
import Test from "@/models/Test";
import { revalidatePath } from "next/cache";


export async function test() {
  await connectDB();

  const data = await Test.find()
  return data;
}

export async function getCredentials() {
  await connectDB();

  const data = await Credential.find()
    .sort({ createdAt: -1 })
    .lean();

  return data.map((item: any) => ({
    ...item,
    _id: item._id.toString(),
  }));
}

export async function createCredential(form: {
  locationId: string;
  sub_account: string;
  sub_account_pass: string;
  sender_id: string;
}) {
  try {
    await connectDB();

    await Credential.create(form);

    revalidatePath("/");

    return { success: true, message: "Created successfully" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateCredential(
  id: string,
  form: {
    locationId: string;
    sub_account: string;
    sub_account_pass: string;
    sender_id: string;
  }
) {
  try {
    await connectDB();

    await Credential.findByIdAndUpdate(id, form);

    revalidatePath("/");

    return { success: true, message: "Updated successfully" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteCredential(id: string) {
  try {
    await connectDB();

    await Credential.findByIdAndDelete(id);

    revalidatePath("/");

    return { success: true, message: "Deleted successfully" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}