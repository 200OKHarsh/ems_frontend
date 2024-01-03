import { AdminLeave, UserLeave } from "@/types/leave";
import UserDataTable from "./UserDataTable";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import axiosInstance from "@/lib/axios";
import Loader from "@/components/Loader";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
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

const data: UserLeave[] = [
  {
    id: "m5gr84i9",
    startdate: "19-12-23",
    enddate: "19-12-23",
    reason: "Test",
    status: "Approved",
  },
  {
    id: "3u1reuv4",
    startdate: "19-12-23",
    enddate: "19-12-23",
    reason: "Test",
    status: "Pending",
  },
  {
    id: "derv1ws0",
    startdate: "19-12-23",
    enddate: "19-12-23",
    reason: "Test",
    status: "Pending",
  },
  {
    id: "5kma53ae",
    startdate: "19-12-23",
    enddate: "19-12-23",
    reason: "Test",
    status: "Reject",
  },
  {
    id: "bhqecj4p",
    startdate: "19-12-23",
    enddate: "19-12-23",
    reason: "Test",
    status: "Reject",
  },
];

interface dataTabel {
  userRole: string;
  data: UserLeave[];
  token: string;
}
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
    cell: () => {
      // const user = row.original;
      
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
            <DropdownMenuItem>Approve Request</DropdownMenuItem>
            <DropdownMenuItem>Reject Request</DropdownMenuItem>
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
          setLeaveData(res.data.allLeaves);
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

const DataTable = ({ userRole, data, token }: dataTabel) => {
  if (userRole === "user") {
    return <UserDataTable data={data} />;
  } else {
    return <Atable token={token} />;
  }
};

const Leave = () => {
  const { userRole, token } = useContext(AuthContext);
  return (
    <>
      <div className="space-y-6 w-3/4 p-4 mx-auto mt-5">
        <DataTable userRole={userRole} data={data} token={token} />
      </div>
    </>
  );
};

export default Leave;
