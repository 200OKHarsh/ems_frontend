import { Separator } from "@/components/ui/separator"
import RegisterFrom from "./RegisterForm"

const Register = () => {
  return (
    <div className="space-y-6 w-1/2 p-4 mx-auto border mt-5">
      <div>
        <h3 className="text-lg font-medium">Register</h3>
        <p className="text-sm text-muted-foreground">
          Create New User
        </p>
      </div>
      <Separator />
      <RegisterFrom />
    </div>
  )
}

export default Register