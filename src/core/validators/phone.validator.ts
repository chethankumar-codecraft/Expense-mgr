import type { ValidatorFn } from "./validator.type.ts";

export const phoneValidator: ValidatorFn = (phoneNumber: string) => {
  return /^[0-9]{10}$/.test(phoneNumber) || phoneNumber === "";
};
