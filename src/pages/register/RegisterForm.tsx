import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import moment from 'moment';
import ImageUpload from '@/components/ImageUpload';
import { useContext, useState } from 'react';
import { useHttpClient } from '@/lib/useAxios';
import { AuthContext } from '@/context/auth-context';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

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

const RegisterFrom = () => {
  const navigate = useNavigate()
  const { sendRequest } = useHttpClient();
  const [imageUrl, setImageUrl] = useState();
  const { token } = useContext(AuthContext);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      aadhar: '',
      pan: '',
      password: '',
      position: '',
      doj: undefined,
    },
  });
  const formData = new FormData();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!imageUrl) {
      return alert('Please Add Image');
    }
    const dateString = values.doj;
    const date = moment(dateString, 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');

    const unixTimestamp = date.unix();

    formData.append('image', imageUrl);
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('aadhar', values.aadhar);
    formData.append('pan', values.pan);
    formData.append('password', values.password);
    formData.append('position', values.position);
    formData.append('doj', unixTimestamp);
try {
  const res = await sendRequest('/users/signup', 'POST', formData, {
    Authorization: `Bearer ${token}`,
  });
  toast({
    variant: 'success',
    title: 'Employee Created!',
  });
  navigate('/')
} catch (error) {
  
}

  };
  const fileHandler = (e: any) => {
    setImageUrl(e);
  };

  return (
    <>
      <ImageUpload onInput={fileHandler} />
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
                          moment(field.value).format('MMM Do YY')
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
          <Button size={'lg'} type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};

export default RegisterFrom;
