"use server";

import connectDB from "@/lib/connectDb";
import Credential from "@/models/Credential";
import Sms from "@/models/Sms";
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

// 🔹 Get All
export async function getSmsData() {
  try {
    await connectDB();
    const data = await Sms.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(data));
  } catch (error: any) {
    return [];
  }
}

// 🔹 Create
export async function createSms(payload: {
  sender_id: string;
  tags: string;
  text: string;
  link: string;
}) {
  try {
    await connectDB();

    if (!payload.sender_id || !payload.text || !payload.tags || !payload.link) {
      return { success: false, message: "All fields are required" };
    }

    await Sms.create(payload);

    return { success: true, message: "SMS created successfully" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// 🔹 Update
export async function updateSms(
  id: string,
  payload: {
    sender_id: string;
    tags: string;
    text: string;
    link: string;
  }
) {
  try {
    await connectDB();

    const updated = await Sms.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!updated) {
      return { success: false, message: "SMS not found" };
    }

    return { success: true, message: "Updated successfully" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// 🔹 Delete
export async function deleteSms(id: string) {
  try {
    await connectDB();

    const deleted = await Sms.findByIdAndDelete(id);

    if (!deleted) {
      return { success: false, message: "SMS not found" };
    }

    return { success: true, message: "Deleted successfully" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}