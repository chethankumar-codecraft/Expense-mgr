import type { ValidatorFn } from "./validator.type.ts";

export const emailValidator: ValidatorFn = (email: string) => {
  const regex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};
