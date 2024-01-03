export interface UserLeave {
  id: string;
  startdate: string;
  enddate: string;
  reason: string;
  status: 'Approved' | 'Pending' | 'Reject';
}

export interface AdminLeave {
  id: string;
  startdate: string;
  enddate: string;
  reason: string;
  status: 'Approved' | 'Pending' | 'Reject';
  email: string;
  user: {
    name: string;
    email: string;
  };
}
