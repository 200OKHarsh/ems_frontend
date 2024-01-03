export interface userDetails {
    id: number;
    name: string;
    email: string;
    doj: string;
    aadhar: string;
    pan: string;
    position: string;
    role: string;
    image: string;
}

export interface userLogin { 
    email: string;
    password: string;
}