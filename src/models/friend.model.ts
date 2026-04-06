import type { Row } from "../core/storage/db.js";

export interface Friend extends Row {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  address: string;
}
