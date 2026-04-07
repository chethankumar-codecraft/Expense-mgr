import type { ValidatorFn } from "../core/validators/validator.type.js";
import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";

export interface AskOptions {
  defaultAnswer?: string | undefined | null;
  validator?: ValidatorFn | undefined;
}

export interface Choice {
  label: string;
  value: string;
}

export const openInterractionManager = () => {
  const rl = readline.createInterface({ input, output });
  const ask: (
    question: string,
    options?: AskOptions,
  ) => Promise<null | string> = async (
    question: string,
    options?: AskOptions,
  ) => {
    const { defaultAnswer, validator } = options || {};
    return new Promise((resolve) => {
      rl.question(
        question + `${defaultAnswer ? "(" + defaultAnswer + ")" : ""}`,
        (answer: string) => {
          if (validator && !validator(answer)) {
            console.log("Invalid input");
            return resolve(ask(question, { defaultAnswer, validator }));
          }
          resolve(answer || defaultAnswer!);
        },
      );
    });
  };
  const choose: (
    question: string,
    choices: Choice[],
    optional?: boolean,
  ) => Promise<undefined | Choice> = async (
    question: string,
    choices: Choice[],
    optional?: boolean,
  ) => {
    console.log(question);
    choices.forEach((choice) => {
      console.log(`${choice.value}. ${choice.label}`);
    });
    const choice = await ask("Please your choice :", {
      validator: (input) => {
        if (optional && input.trim()) return true;
        return choices.some((choice) => choice.value === input);
      },
    });
    return choices.find((c) => c.value == choice);
  };

  const close = () => {
    rl.close();
  };
  return {
    ask,
    choose,
    close,
  };
};
