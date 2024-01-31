import { AdminLeave, UserLeave } from "@/types/leave";
import UserDataTable from "./UserDataTable";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import axiosInstance from "@/lib/axios";
import Loader from "@/components/Loader";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminDataTable } from "./AdminDataTable";
import moment from "moment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { ValidationError } from "@/types/error";
import { Link } from "react-router-dom";
interface tableToken {
  token: string;
}
interface setLeavedata {
  allLeaves: AdminLeave[];
}

const columns: ColumnDef<AdminLeave>[] = [
  {
    accessorKey: "name",
    accessorFn: (row) => `${row.user.name}`,
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "start",
    header: "Start",
    cell: ({ row }) => (
      <div className="capitalize">
        {moment(row.getValue("start")).format("MMM Do YY")}
      </div>
    ),
  },
  {
    accessorKey: "end",
    header: "End",
    cell: ({ row }) => (
      <div className="capitalize">
        {moment(row.getValue("end")).format("MMM Do YY")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "reason",
    header: () => <div>Reason</div>,
    cell: ({ row }) => {
      return <div>{row.getValue("reason")}</div>;
    },
  },
  {
    accessorKey: "email",
    accessorFn: (row) => `${row.user.email}`,
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { token } = useContext(AuthContext);
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const user = row.original;
      const updateStatus = async (id: string, status: boolean) => {
        try {
          await axiosInstance.patch(
            `/leave/updateStatus/${id}`,
            { status: status ? "Approved" : "Rejected" },
            config
          );
          toast({
            title: "Status Updated",
            variant: "success",
          });
        } catch (error) {
          if (
            axios.isAxiosError<ValidationError, Record<string, unknown>>(error)
          ) {
            console.log(error);
          } else {
            console.error(error);
          }
        }
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* // onClick={() => navigator.clipboard.writeText(payment.id)} */}
            <DropdownMenuItem onClick={() => updateStatus(user.id, true)}>
              Approve Request
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateStatus(user.id, false)}>
              Reject Request
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
const Atable = ({ token }: tableToken) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const [leaveData, setLeaveData] = useState<AdminLeave[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      await axiosInstance
        .get<setLeavedata>("/leave", config)
        .then((res) => {
          setLeaveData(res.data.allLeaves.reverse());
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }
  if (leaveData) {
    return <AdminDataTable columns={columns} data={leaveData} />;
  }
};

const DataTable = ({ token }: tableToken) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const [leaveData, setLeaveData] = useState<UserLeave[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const userId = JSON.parse(localStorage.getItem("user") || "{}").user.userId;

  useEffect(() => {
    const fetchData = async () => {
      await axiosInstance
        .get<setLeavedata>(`/leave/user/${userId}`, config)
        .then((res) => {
          setLeaveData(res.data.allLeaves.reverse());
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }
  if (leaveData) {
    return <UserDataTable data={leaveData} />;
  }
};

const Leave = () => {
  const { userRole, token } = useContext(AuthContext);
  return (
    <>
      <div className="mt-5">
        <Link
          to={"/"}
          className="ml-[13.5%] w-12 items-center rounded-md border px-5 py-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80"
        >
          Back
        </Link>
      </div>
      <div className="space-y-6 w-3/4 p-4 mx-auto mt-5">
        {userRole === "user" && <DataTable token={token} />}
        {userRole === "admin" && <Atable token={token} />}
      </div>
    </>
  );
};

export default Leave;
