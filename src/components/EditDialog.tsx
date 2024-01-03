import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import { AuthContext } from '@/context/auth-context';
import { zodResolver } from '@hookform/resolvers/zod';
import moment from 'moment';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, User } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { userDetails } from '@/types/user';
import axiosInstance from '@/lib/axios';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Please Enter Name.',
  }),
  email: z.string({ required_error: 'Please Enter A Valid Email.' }).email(),
  password: z.string().min(4, {
    message: 'Password length more than 4 needed .',
  }),
  doj: z.date({
    required_error: 'Enter the joining date',
  }),
  position: z.string().min(2, {
    message: 'Please Enter A Valid Position.',
  }),
  aadhar: z.string().min(2, {
    message: 'Please Enter A Valid Aadhar Number.',
  }),
  pan: z.string().min(2, {
    message: 'Please Enter A Valid Pan.',
  }),
});

const editSchema = z.object({
  name: z.string().min(2, {
    message: 'Please Enter Name.',
  }),
  password: z.string().min(4, {
    message: 'Please Provide Password',
  }),
});
interface propType {
  userData: userDetails;
}

interface editType {
  id: number;
  name: string;
  token: string;
}

interface editUser {
  userData: propType;
  token: string;
}

const AdminEdit = ({ userData, token }: editUser) => {
  const [open, setOpen] = useState(false);

  const date = new Date(userData.doj * 1000);
  const options = {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userData.name,
      email: userData.email,
      aadhar: userData.aadhar,
      pan: userData.pan,
      password: '',
      position: userData.position,
      doj: new Date(formattedDate),
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const dateString = values.doj;
    const date = moment(dateString, 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');

    const unixTimestamp = date.unix();
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    await axiosInstance
      .patch(
        `/users/editprofile/${userData.id}`,
        {
          name: values.name,
          email: values.email,
          password: values.password,
          aadhar: values.aadhar,
          pan: values.pan,
          position: values.position,
          doj: unixTimestamp,
        },
        config
      )
      .then((res) => {
        setOpen(false);
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
        {/* <ImageUpload onInput={fileHandler} /> */}
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
            <FormField
              control={form.control}
              name="doj"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Joining</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            moment(field.value).format('LL')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
  const form = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: name,
      password: '',
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
      .then((res) => {
        setOpen(false);
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
    JSON.parse(localStorage.getItem('user') || '{}').role === 'admin';
  return (
    <>
      {!isAdmin && (
        <UserEdit name={userData.name} id={userData.id} token={token} />
      )}
      {isAdmin && <AdminEdit userData={userData} token={token} />}
    </>
  );
};

export default EditDialog;
