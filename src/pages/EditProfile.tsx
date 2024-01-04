import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import Loader from '@/components/Loader';
import { userDetails } from '@/types/user';
import moment from 'moment';
import EditDialog from '@/components/EditDialog';
import { Edit2Icon } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import MainDialog from '@/components/MainDialog';
import { AuthContext } from '@/context/auth-context';
import { toast } from '@/components/ui/use-toast';
import ErrorDialog from '@/components/ErrorDialog';
import axios from 'axios';
import { ValidationError } from '@/types/error';

const EditProfile = () => {
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
    const fetchUser = async () => {
      setIsLoading(true);
      await axiosInstance
        .get<userDetails>(`/users/${uId}`)
        .then((res) => {
          setUser(res.data);
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
      formData.append('image', imageurl);
    } else {
      setEditImage(true);
      return toast({
        title: 'No Image Found',
      });
    }
    try {
      await axiosInstance.patch(`/users/editimage/${uId}`, formData, config);
      setEditImage(false);
      toast({
        title: 'Profile Updated',
      });
      navigate('/');
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
          onClose={() => setError('')}
          title="Error"
          message={error}
        />
      )}
      <div className="grid grid-cols-2 w-1/2 p-4 mx-auto border mt-5">
        <div className="col-span-1 flex">
          <img
            src={`https://raw.githubusercontent.com/200OKHarsh/ems_server/main/uploads/images/${user?.image}`}
            alt={user?.name}
            width={150}
            height={150}
            className={
              'h-auto object-cover transition-all hover:scale-105 aspect-square w-[150px]'
            }
          />

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
          {(userId === uId || userRole === 'admin') && (
            <Button onClick={handleUpload} className=" rounded-xl p-2 w-8 h-8">
              <Edit2Icon />
            </Button>
          )}
        </div>
        <div className="col-span-1 flex flex-col space-y-3">
          <h3>Name: {user?.name}</h3>
          <h3>Email: {user?.email}</h3>
          <h3>Joined Date: {moment.unix(Number(user?.doj)).format('LL')}</h3>
          {(userId === uId || userRole === 'admin') && user && (
            <EditDialog userData={user} />
          )}
        </div>
      </div>
      <div className="w-1/2 p-4 mx-auto border mt-5 space-y-4">
        <h3 className="text-lg font-medium">Other Details</h3>
        <Separator className="my-4" />
        <h2>Position: {user?.position}</h2>
        <h2>Aadhar Number: {user?.aadhar}</h2>
        <h2>Pan Number: {user?.pan}</h2>
        <h2>Role: {user?.role}</h2>
      </div>
    </>
  );
};

export default EditProfile;
