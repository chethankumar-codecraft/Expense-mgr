import type { ValidatorFn } from "./validator.type.ts";

export const numberValidator: ValidatorFn = (input: string) => {
  return !isNaN(+input);
};

// enum myEnum {
//   option1,
//   option2,
//   option3,
// }

// console.log(myEnum.option1);
