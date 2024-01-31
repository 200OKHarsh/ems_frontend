import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import Loader from "@/components/Loader";
import { userDetails } from "@/types/user";
import moment from "moment";
import EditDialog from "@/components/EditDialog";
import ImageUpload from "@/components/ImageUpload";
import MainDialog from "@/components/MainDialog";
import { AuthContext } from "@/context/auth-context";
import { toast } from "@/components/ui/use-toast";
import ErrorDialog from "@/components/ErrorDialog";
import axios from "axios";
import { ValidationError } from "@/types/error";
import { decryptionAES } from "@/lib/crypto";
import { editUser, userSelector } from "@/store/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { format } from "date-fns";

const EditProfile = () => {
  const selectedUsers = useAppSelector(userSelector);
  const dispatch = useAppDispatch();
  const uId = useParams().userId;
  const { userId, userRole, token } = useContext(AuthContext);
  const [user, setUser] = useState<userDetails>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editImage, setEditImage] = useState<boolean>(false);
  const [imageurl, setImageUrl] = useState<string>();
  const [error, setError] = useState<string>();
  const navigate = useNavigate();

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    setUser(selectedUsers);
  }, [selectedUsers]);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      await axiosInstance
        .get<userDetails>(`/users/${uId}`)
        .then((res) => {
          // setUser(res.data);
          dispatch(editUser(res.data));
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    };
    fetchUser();
  }, []);

  const handleUpload = () => {
    setEditImage((prev) => !prev);
  };
  const fileHandler = (e: any) => {
    setImageUrl(e);
  };
  const uploadImage = async () => {
    const formData = new FormData();
    if (imageurl) {
      formData.append("image", imageurl);
    } else {
      setEditImage(true);
      return toast({
        title: "No Image Found",
      });
    }
    try {
      await axiosInstance.patch(`/users/editimage/${uId}`, formData, config);
      setEditImage(false);
      toast({
        title: "Profile Updated",
      });
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
        setError(error.response?.data.message);
      } else {
        console.error(error);
      }
    }
  };
  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      {error && (
        <ErrorDialog
          open={!!error}
          onClose={() => setError("")}
          title="Error"
          message={error}
        />
      )}

      {user && (
        <>
          <div className="mt-5">
            <Link
              to={"/"}
              className="ml-[12%] w-12 items-center rounded-md border px-5 py-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80"
            >
              Back
            </Link>
          </div>
          <div className="grid md:grid-cols-2 md:w-1/2 w-3/4 space-y-4 p-4 mx-auto border mt-5">
            <div className="col-span-1 flex justify-center md:justify-normal">
              <div className="relative group">
                <div className="absolute inset-0 z-10 bg-slate-50/5 text-center flex flex-col items-center justify-center opacity-0 hover:opacity-100 bg-opacity-90 duration-300">
                  {(userId === uId || userRole === "admin") && (
                    <Button onClick={handleUpload} className="rounded-xl p-2">
                      Edit Image
                    </Button>
                  )}
                </div>
                <div className="relative">
                  <div>
                    <img
                      src={`http://localhost:5000/${user?.image}`}
                      alt={user?.name}
                      width={150}
                      height={150}
                      className="rounded-full h-[150px] object-cover transition-all group-hover:blur-sm aspect-square w-[150px]"
                    />
                  </div>
                </div>
              </div>
              {editImage && (
                <MainDialog
                  open={editImage}
                  bodyClass="sm:max-w-md"
                  title="Edit Profile Image"
                  submitButton="Upload"
                  onClose={() => setEditImage(false)}
                  onSubmit={uploadImage}
                  isSubmit={true}
                >
                  <div className="p-5">
                    <ImageUpload onInput={fileHandler} />
                  </div>
                </MainDialog>
              )}
            </div>

            <div className="col-span-1 flex flex-col space-y-3">
              <h3>Name: {user?.name}</h3>
              <h3>Email: {user?.email}</h3>
              <h3>
                Joined Date: {moment(user.doj).format("DD-MM-YYYY")}
              </h3>
              {(userId === uId || userRole === "admin") && user && (
                <EditDialog userData={user} />
              )}
            </div>
          </div>
        </>
      )}
      {user && (
        <div className="md:w-1/2 w-3/4 p-4 mx-auto border mt-5 space-y-4">
          <h3 className="text-lg font-medium">Other Details</h3>
          <Separator className="my-4" />
          <h2>Position: {user?.position}</h2>
          <h2>Aadhar Number: {decryptionAES(user?.aadhar)}</h2>
          <h2>Pan Number: {decryptionAES(user?.pan)}</h2>
          <h2>Role: {user?.role}</h2>
        </div>
      )}
    </>
  );
};

export default EditProfile;
