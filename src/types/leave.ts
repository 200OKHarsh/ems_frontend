export interface UserLeave {
  id: string;
  start: string;
  end: string;
  reason: string;
  status: 'Approved' | 'Pending' | 'Reject';
}

export interface AdminLeave {
  id: string;
  start: string;
  end: string;
  reason: string;
  status: 'Approved' | 'Pending' | 'Reject';
  email: string;
  user: {
    id:string
    name: string;
    email: string;
    position: string;
    image: string;
  };
}
