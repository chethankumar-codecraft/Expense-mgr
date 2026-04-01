import type { ValidatorFn } from "./validator.type.js";

export const phoneValidator: ValidatorFn = (phoneNumber: string) => {
  return /^[0-9]{10}$/.test(phoneNumber) || phoneNumber === "";
};
