"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { createCredential, createSms, deleteCredential, deleteSms, getCredentials, getSmsData, updateCredential, updateSms } from "@/actions/page";
import { Eye, EyeOff, Trash } from "lucide-react";

type Credential = {
  _id: string;
  locationId: string;
  sub_account: string;
  sub_account_pass: string;
  sender_id: string;
};


type SmsItem = {
  _id: string;
  sender_id: string;
  tags: string;
  text: string;
  link: string;
};

const formData = {
    locationId: "",
    sub_account: "",
    sub_account_pass: "",
    sender_id: "",
  };


const smsFormData = {
  sender_id: "",
  tags: "",
  text: "",
  link: "",
};

export default function Home() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(formData);
  const [smsList, setSmsList] = useState<SmsItem[]>([]);
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [smsEditId, setSmsEditId] = useState<string | null>(null);
  const [smsForm, setSmsForm] = useState(smsFormData);
  const addToast = useToast();

  const resetForm = () => {
    setEditId(null);
    setForm(formData);
    setShow(false);
  };

const load = async () => {
  const data = await getCredentials();
  setCredentials(data as any);
};

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    try {
      let res;

      if (editId) {
        res = await updateCredential(editId, form);
      } else {
        res = await createCredential(form);
      }

      if (res.success) {
        addToast(res.message || "Saved successfully", "success");
        setModalOpen(false);
        load();
      } else {
        addToast(res.message, "error");
      }
    } catch (error: any) {
      addToast(error.message || "Server error", "error");
    }
  };

  const edit = (item: Credential) => {
    setEditId(item._id);
    setForm({
      locationId: item.locationId,
      sub_account: item.sub_account,
      sub_account_pass: item.sub_account_pass,
      sender_id: item.sender_id,
    });
    setModalOpen(true);
  };

  const del = async (id: string) => {
    const res = await deleteCredential(id);

    if (res.success) {
      addToast(res.message || "Deleted successfully", "success");
      load();
    } else {
      addToast(res.message || "Delete failed", "error");
    }
  };

  const loadSms = async () => {
  const data = await getSmsData(); // create this in backend
  setSmsList(data as any);
};

useEffect(() => {
  loadSms();
}, []);

const saveSms = async () => {
  try {
    let res;

    if (smsEditId) {
      res = await updateSms(smsEditId, smsForm);
    } else {
      res = await createSms(smsForm);
    }

    if (res.success) {
      addToast(res.message || "Saved successfully", "success");
      setSmsModalOpen(false);
      loadSms();
    } else {
      addToast(res.message, "error");
    }
  } catch (error: any) {
    addToast(error.message || "Server error", "error");
  }
};

const editSms = (item: SmsItem) => {
  setSmsEditId(item._id);
  setSmsForm({
    sender_id: item.sender_id,
    tags: item.tags,
    text: item.text,
    link: item.link,
  });
  setSmsModalOpen(true);
};

const deleteSmsItem = async (id: string) => {
  const res = await deleteSms(id);

  if (res.success) {
    addToast(res.message || "Deleted successfully", "success");
    loadSms();
  } else {
    addToast(res.message || "Delete failed", "error");
  }
};

const resetSmsForm = () => {
  setSmsEditId(null);
  setSmsForm(smsFormData);
};
  

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl mb-4">Accounts Credentials</h2>
      <Button
        onClick={() => {
          resetForm();
          setModalOpen(true);
        }}
        className="mb-4 cursor-pointer"
      >
        + Add New
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Location ID</TableHead>
            <TableHead>Sub Account</TableHead>
            <TableHead>Sender</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {credentials.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.locationId}</TableCell>
              <TableCell>{item.sub_account}</TableCell>
              <TableCell>{item.sender_id}</TableCell>
              <TableCell className="space-x-2">
                <Button className="hover:text-white hover:bg-black cursor-pointer" variant="outline" size="sm" onClick={() => edit(item)}>
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="cursor-pointer" size="sm">
                      <Trash />
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the credential.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => del(item._id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal */}
      <Dialog
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Credential" : "Add Credential"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input placeholder="Location ID" value={form.locationId} onChange={(e) => setForm({ ...form, locationId: e.target.value })} />
            <Input placeholder="Sub Account" value={form.sub_account} onChange={(e) => setForm({ ...form, sub_account: e.target.value })} />
            <Input placeholder="Sender ID" value={form.sender_id} onChange={(e) => setForm({ ...form, sender_id: e.target.value })} />
            <div className="relative">
            <Input type={show ? "text" : "password"} placeholder="Password" value={form.sub_account_pass} onChange={(e) => setForm({ ...form, sub_account_pass: e.target.value })} />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShow(!show)}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editId ? "Update" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= SMS SECTION ================= */}

<div className="mt-10">
  <h2 className="text-2xl mb-4">SMS Configuration</h2>

  <Button
    onClick={() => {
      resetSmsForm();
      setSmsModalOpen(true);
    }}
    className="mb-4 cursor-pointer"
  >
    + Add SMS
  </Button>

  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Sender ID</TableHead>
        <TableHead>Tags</TableHead>
        <TableHead>Text</TableHead>
        <TableHead>Link</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      {smsList.map((item) => (
        <TableRow key={item._id}>
          <TableCell>{item.sender_id}</TableCell>
          <TableCell>{item.tags}</TableCell>
          <TableCell>{item.text}</TableCell>
          <TableCell>{item.link}</TableCell>

          <TableCell className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => editSms(item)}
            >
              Edit
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash />
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the SMS config.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteSmsItem(item._id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  <Dialog
  open={smsModalOpen}
  onOpenChange={(open) => {
    setSmsModalOpen(open);
    if (!open) resetSmsForm();
  }}
>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>
        {smsEditId ? "Edit SMS" : "Add SMS"}
      </DialogTitle>
    </DialogHeader>

    <div className="space-y-4">
      <Input
        placeholder="Sender ID"
        value={smsForm.sender_id}
        onChange={(e) =>
          setSmsForm({ ...smsForm, sender_id: e.target.value })
        }
      />

      <Input
        placeholder="Tags"
        value={smsForm.tags}
        onChange={(e) =>
          setSmsForm({ ...smsForm, tags: e.target.value })
        }
      />

      <Input
        placeholder="Text"
        value={smsForm.text}
        onChange={(e) =>
          setSmsForm({ ...smsForm, text: e.target.value })
        }
      />

      <Input
        placeholder="Link"
        value={smsForm.link}
        onChange={(e) =>
          setSmsForm({ ...smsForm, link: e.target.value })
        }
      />
    </div>

    <DialogFooter className="mt-4 flex justify-end space-x-2">
      <Button onClick={() => setSmsModalOpen(false)}>
        Cancel
      </Button>
      <Button onClick={saveSms}>
        {smsEditId ? "Update" : "Save"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
</div>
    </div>
  );
}