export interface Friend {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number; //+ve means they owe you, -ve means you owe them
}
