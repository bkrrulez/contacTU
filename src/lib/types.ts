export type Contact = {
  id: string;
  firstName: string;
  lastName:string;
  email: string;
  phone: string;
  mobile?: string;
  address?: string;
  organization: string;
  designation: string;
  notes?: string;
  avatar: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Power User' | 'Standard User' | 'Read-Only';
  avatar: string;
};
