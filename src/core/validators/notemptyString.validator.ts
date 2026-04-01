import type { ValidatorFn } from "./validator.type.ts";

export const notEmpty: ValidatorFn = (input: string) => {
  return input.trim() !== "";
};
