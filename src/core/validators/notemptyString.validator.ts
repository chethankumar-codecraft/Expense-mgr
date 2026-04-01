import type { ValidatorFn } from "./validator.type.js";

export const notEmpty: ValidatorFn = (input: string) => {
  return input.trim() !== "";
};
