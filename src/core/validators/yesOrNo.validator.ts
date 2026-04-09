import type { ValidatorFn } from "./validator.type.js";

export const yesOrNo: ValidatorFn = (input: string) => {
  return input.trim() !== "" && (input === "y" || input === "n");
};
