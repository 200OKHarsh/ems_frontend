import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CalendarIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useContext, useState } from "react";
import { UserLeave } from "@/types/leave";
import MainDialog from "@/components/MainDialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/components/ui/use-toast";
import axiosInstance from "@/lib/axios";
import { AuthContext } from "@/context/auth-context";
import axios from "axios";
import { ValidationError } from "@/types/error";
import ErrorDialog from "@/components/ErrorDialog";
import moment from "moment";
import { format } from "date-fns";

interface DataTableProps {
  data: UserLeave[];
}

export const columns: ColumnDef<UserLeave>[] = [
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
    header: () => <div className="text-right">Reason</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("reason")}</div>
      );
    },
  },
];

const FormSchema = z.object({
  date: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .refine(
      (data) => data.to > data.from,
      "Start date must be in the future"
    ),
  reason: z.string().min(2, {
    message: "Please Enter Reason.",
  }),
});

const UserDataTable = ({ data }: DataTableProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      reason: "",
    },
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [leaveData, setLeaveData] = useState<UserLeave[]>(data);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [isModal, setIsModal] = useState<boolean>(false);
  const { token } = useContext(AuthContext);
  const [error, setError] = useState<string>();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const table = useReactTable({
    data: leaveData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {

    const newLeave = {
      start: data.date.from,
      end: data.date.to,
      reason: data.reason
    }
    await axiosInstance
      .post("/leave", newLeave, config)
      .then(() => {
        toast({
          title: "Leave Applied !",
          variant: "success",
        });
        setIsModal(false);
        
        // Update State Tempory to Show Data without refresh
        const tempData: UserLeave = {
          id: Math.random().toString(),
          start: data.date.from.toISOString(),
          end: data.date.to.toISOString(),
          reason: data.reason,
          status: "Pending",
        };

        const leave = [tempData, ...leaveData];
        
        setLeaveData(leave);
      })
      .catch((error) => {
        if (
          axios.isAxiosError<ValidationError, Record<string, unknown>>(error)
        ) {
          setError(error.response?.data.message);
        } else {
          console.error(error);
        }
      });
  };

  const handleClose = () => {
    form.reset();
    setIsModal(false);
  };

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
      {isModal && (
        <MainDialog
          open={isModal}
          bodyClass="max-w-sm mx-auto"
          title="Leave"
          onClose={handleClose}
        >
          <div className="w-[300px] space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value?.from ? (
                                field.value.to ? (
                                  <>
                                    {format(field.value.from, "LLL dd, y")} -{" "}
                                    {format(field.value.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(field.value.from, "LLL dd, y")
                                )
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              initialFocus
                              mode="range"
                              defaultMonth={field.value?.from}
                              selected={field.value}
                              onSelect={field.onChange}
                              numberOfMonths={2}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormDescription>
                        Select the date for when the leave will take place
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason</FormLabel>
                      <FormControl>
                        <Input placeholder="Reason" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>
        </MainDialog>
      )}
      <div className="w-full">
        <div className="flex items-center py-4 justify-between">
          <Button onClick={() => setIsModal(true)}>
            <PlusIcon /> Add New
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Total {table.getFilteredRowModel().rows.length} Leaves
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDataTable;
