import type { Row } from "../core/storage/db.js";

export interface Friend extends Row {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  balance: number | null;
  address: string | null;
}
