import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useHttpClient } from "@/lib/useAxios";
import { useToast } from "@/components/ui/use-toast";
import ErrorDialog from "@/components/ErrorDialog";
import { AuthContext } from "@/context/auth-context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/Loader";
import { loginResponse } from "@/types/user";

const formSchema = z.object({
  email: z.string({ required_error: "Please Enter A Valid Email." }).email(),
  password: z.string().min(4, {
    message: "Password length more than 4 needed .",
  }),
});

const LoginForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLoading, error, clearError, sendRequest } = useHttpClient();
  const { setAuthenticated, setToken } = useContext(AuthContext);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await sendRequest<loginResponse>(
        "/users/login",
        "POST",
        JSON.stringify(values),
        { "Content-Type": "application/json" }
      );
      toast({
        variant: "success",
        title: "Logged in Succesfully!",
      });
      const expireDate = new Date(new Date().getTime() + 1000 * 60 * 60);
      localStorage.setItem(
        "user",
        JSON.stringify({ user: res.data, exp: expireDate.toISOString() })
      );
      setAuthenticated(true);
      if (res.data?.token !== undefined) {
        setToken(res?.data?.token);
      }
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {error && (
        <ErrorDialog
          open={!!error}
          onClose={clearError}
          title="Error"
          message={error}
        />
      )}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Log In</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Separator />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <Button className="w-full" type="submit">
                {isLoading && <Loader />}
                {!isLoading && "Log In"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default LoginForm;
