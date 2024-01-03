import SearchBar from '@/components/SearchBar';
import { listenNowAlbums } from '@/components/dummy_data/albums';
import UserCard from '@/components/UserCard';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ErrorDialog from '@/components/ErrorDialog';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import { userDetails } from '@/types/user';
import axiosInstance from '@/lib/axios';
import { ValidationError } from '@/types/error';
import axios from 'axios';

const Dashboard = () => {
  const [users, setUsers] = useState<userDetails[]>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get<userDetails[]>('/users');
        const userResponse = res.data.filter((u) => u.role !== 'admin');
        setUsers(userResponse);
        setIsLoading(false);
      } catch (error) {
        if (
          axios.isAxiosError<ValidationError, Record<string, unknown>>(error)
        ) {
          setError(error.response?.data.message);
        } else {
          console.error(error);
        }
      }
    };

    fetchUser();
  }, []);

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
      <div className="hidden md:block">
        <div className="border-t">
          <div className="bg-background">
            <div>
              <div className=" lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">
                  <Tabs defaultValue="employee" className="h-full space-y-6">
                    <div className="space-between flex items-center">
                      <TabsList>
                        <TabsTrigger value="employee" className="relative">
                          All Employee
                        </TabsTrigger>
                        <TabsTrigger value="leave">On Leave</TabsTrigger>
                      </TabsList>
                      <div className="ml-auto mr-4">
                        <SearchBar placeholder="Search Employe" />
                      </div>
                    </div>
                    {isLoading && <Loader />}
                    {!isLoading && users && users.length >= 1 && (
                      <TabsContent
                        value="employee"
                        className="border-none p-0 outline-none"
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h2 className="text-2xl font-semibold tracking-tight">
                              {users.length}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              Employees
                            </p>
                          </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="relative">
                          <div className="flex space-x-4 pb-4">
                            {users.map((user, index) => (
                              <UserCard
                                key={index}
                                user={user}
                                className="w-[150px]"
                                aspectRatio="square"
                                width={150}
                                height={150}
                              />
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    )}
                    <TabsContent
                      value="leave"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            {listenNowAlbums.length}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Employees
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="relative">
                        {/* <div className="flex space-x-4 pb-4">
                          {listenNowAlbums.map((album) => (
                            <UserCard
                              key={album.name}
                              album={album}
                              className="w-[150px]"
                              aspectRatio="square"
                              width={150}
                              height={150}
                            />
                          ))}
                        </div> */}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
