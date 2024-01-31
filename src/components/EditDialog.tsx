import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/context/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { userDetails } from "@/types/user";
import axiosInstance from "@/lib/axios";
import { decryptionAES, encryptAES } from "@/lib/crypto";
import { useAppDispatch } from "@/store/hooks";
import { editUser } from "@/store/features/userSlice";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Please Enter Name.",
  }),
  email: z.string({ required_error: "Please Enter A Valid Email." }).email(),
  password: z
  .union([
    z.string().min(4, {
      message: "Password must contain at least 4 character",
    }),
    z.string().length(0),
  ])
  .optional()
  .transform((e) => (e === "" ? undefined : e)),
  position: z.string().min(2, {
    message: "Please Enter A Valid Position.",
  }),
  aadhar: z.string().min(2, {
    message: "Please Enter A Valid Aadhar Number.",
  }),
  pan: z.string().min(2, {
    message: "Please Enter A Valid Pan.",
  }),
});

const editSchema = z.object({
  name: z.string().min(2, {
    message: "Please Enter Name.",
  }),
  password: z
    .union([
      z.string().min(4, {
        message: "Password must contain at least 4 character",
      }),
      z.string().length(0),
    ])
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
});
interface propType {
  userData: userDetails;
}

interface editType {
  id: string;
  name: string;
  token: string;
}

interface editUser {
  data: userDetails;
  token: string;
}

const AdminEdit = ({ data, token }: editUser) => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name,
      email: data.email,
      aadhar: decryptionAES(data.aadhar),
      pan: decryptionAES(data.pan),
      password: "",
      position: data.position,
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    await axiosInstance
      .patch(
        `/users/editprofile/${data.id}`,
        {
          name: values.name,
          email: values.email,
          password: values.password,
          aadhar: encryptAES(values.aadhar),
          pan: encryptAES(values.pan),
          position: values.position,
        },
        config
      )
      .then(() => {
        setOpen(false);
        const newData = {
          id: data.id,
          name: values.name,
          email: values.email,
          aadhar: encryptAES(values.aadhar),
          pan: encryptAES(values.pan),
          position: values.position,
          doj: data.doj,
          image: data.image,
          role: 'user'
        }
        dispatch(editUser(newData));

      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)} variant="outline">
        Edit Profile
      </Button>
      <DialogContent className="sm:max-w-prose h-3/4 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to Users profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input placeholder="Position" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aadhar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aadhar Card Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Aadhar Card Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pan Card Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Pan Card Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const UserEdit = ({ name, id, token }: editType) => {
  const dispatch = useAppDispatch();
  
  const form = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: name,
      password: "",
    },
  });
  const [open, setOpen] = useState(false);
  const onSubmit = async (values: z.infer<typeof editSchema>) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    await axiosInstance
      .patch(
        `/users/edituser/${id}`,
        {
          name: values.name,
          password: values.password,
        },
        config
      )
      .then(() => {
        setOpen(false);
        dispatch(editUser({name: values.name, id: id }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="New Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const EditDialog = ({ userData }: propType) => {
  const { token } = useContext(AuthContext);

  const isAdmin =
    JSON.parse(localStorage.getItem("user") || "{}").user.role === "admin";
  return (
    <>
      {!isAdmin && (
        <UserEdit name={userData.name} id={userData.id} token={token} />
      )}
      {isAdmin && <AdminEdit data={userData} token={token} />}
    </>
  );
};

export default EditDialog;
