import SearchBar from "@/components/SearchBar";
import UserCard from "@/components/UserCard";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ErrorDialog from "@/components/ErrorDialog";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { userDetails } from "@/types/user";
import axiosInstance from "@/lib/axios";
import { ValidationError } from "@/types/error";
import axios from "axios";
import { AdminLeave } from "@/types/leave";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const Dashboard = () => {
  const [users, setUsers] = useState<userDetails[]>();
  const [filterusers, setFilterUsers] = useState<userDetails[]>();
  const [leaves, setLeaves] = useState<AdminLeave[]>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get<userDetails[]>("/users");
        await axiosInstance
          .get<AdminLeave[]>("/leave/active")
          .then((res) => {
            setLeaves(res.data);
          })
          .catch((error) => {
            console.log(error);
          });

        const userResponse = res.data.filter((u) => u.role !== "admin");
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

  useEffect(() => {
    if (users) {
      if (search.trim().length === 0) {
        setFilterUsers(users);
      } else {
        const data = users.filter((user) =>
          user.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilterUsers(data);
      }
    }
  }, [search, users]);

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
      <div>
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
                    </div>
                    {isLoading && <Loader />}
                    {!isLoading && (
                      <TabsContent
                        value="employee"
                        className="border-none p-0 outline-none"
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h2 className="text-2xl font-semibold tracking-tight">
                              {filterusers?.length}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              Employees
                            </p>
                          </div>
                          <SearchBar
                            setSearch={setSearch}
                            placeholder="Search Employe"
                          />
                        </div>
                        <Separator className="my-4" />
                        <div className="relative">
                          <div className="flex space-x-4 pb-4">
                            {filterusers &&
                              filterusers.length >= 1 &&
                              filterusers.map((user, index) => (
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
                          {filterusers?.length === 0 && <h1>No User Found</h1>}
                        </div>
                      </TabsContent>
                    )}
                    {leaves && (
                      <TabsContent
                        value="leave"
                        className="h-full flex-col border-none p-0 data-[state=active]:flex"
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h2 className="text-2xl font-semibold tracking-tight">
                              {leaves.length}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              Employees
                            </p>
                          </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="relative">
                          <div className="flex space-x-4 pb-4">
                            {leaves.map((leave, index) => (
                              <div key={index} className="space-y-3 w-[150px]">
                                <Link to={`/user/${leave.user.id}`}>
                                  <div className="overflow-hidden rounded-md">
                                    <img
                                      src={`http://localhost:5000/${leave.user.image}`}
                                      alt={leave.user.name}
                                      width={150}
                                      height={150}
                                      className={
                                        "h-auto w-auto object-cover transition-all hover:scale-105 aspect-square"
                                      }
                                    />
                                  </div>
                                  <div className="space-y-1 text-sm">
                                    <h3 className="font-medium leading-none">
                                      {leave.user.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                      {leave.user.position}
                                    </p>
                                  </div>
                                  <p className="text-xs">
                                    {format(
                                      new Date(leave.start),
                                      "dd/MM/yyyy"
                                    )}{" "}
                                    -{" "}
                                    {format(new Date(leave.end), "dd/MM/yyyy")}
                                  </p>
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                        {leaves.length <= 0 && (
                          <h1>Nobody is on leave today</h1>
                        )}
                      </TabsContent>
                    )}
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
