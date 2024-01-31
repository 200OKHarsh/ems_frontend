import { Toaster } from "@/components/ui/toaster";
import LoginForm from "./LoginForm";
import bg from "@/assets/patternpad.svg";

const Register = () => {
  return (
    <>
      <div className="space-y-6 w-1/2 p-4 mx-auto mt-5 z-10 relative">
      <h1 className="text-9xl font-bold text-primary text-center mt-5">EMS</h1>
        <LoginForm />
        <Toaster />
      </div>
      <img src={bg} alt="bg" className={"absolute h-full w-full z-0 inset-0"} />
    </>
  );
};

export default Register;
