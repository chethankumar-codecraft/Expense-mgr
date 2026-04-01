export interface Friend {
  id: string;
  name: string;
  email: string |undefined;
  phone: string|undefined;
  balance: number; //+ve means they owe you, -ve means you owe them
}
