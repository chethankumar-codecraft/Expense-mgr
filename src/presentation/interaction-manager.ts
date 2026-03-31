const readline = require("node:readline");
// import * as readline from "node:readline";
const { stdin: input, stdout: output } = require("node:process");

export interface AskOptions {
  defaultAnswer?: string | undefined;
  validator?: ((s: string) => boolean) | undefined;
}

export interface Choice {
  label: string;
  value: string;
}

// const genders: Choice[] = [{ label: "Male", value: "M" }];

// const expenseTypes: Choice[] = [{ label: "Food", value: "FOOD" }];

export const initialiseInteractionManager = () => {
  const rl = readline.createInterface({ input, output });
  const ask = async (question: string, options: AskOptions) => {
    const { defaultAnswer, validator } = options || {};
    return new Promise((resolve) => {
      rl.question(
        question + `${defaultAnswer ? "(" + defaultAnswer + ")" : ""}`,
        (answer: string) => {
          if (validator && !validator(answer)) {
            console.log("Invalid");
            resolve(ask(question, { defaultAnswer, validator }));
          }
          resolve(answer || defaultAnswer);
        },
      );
    });
  };
  const choose = async (question: string, choices: Choice[]) => {
    console.log(question);
    choices.forEach((choice) => {
      console.log(`${choice.value}. ${choice.label}`);
    });
    return ask("Please your choice", {
      validator: (input) => choices.some((choice) => choice.value === input),
    });
  };
};

// const run = async () => {
//   console.log(
//     "---------------WELCOME TO SPLIT EXPENSE DASHBOARD------------------",
//   );
//   while (true) {
//     const prompt =
//       "\n Options:\n\t1. Add New friend\n\t2. Show my friends\n\t3. Exit\nYour choice: ";
//     const choice = await ask(prompt, {
//       defaultAnswer: undefined,
//       validator: undefined,
//     });

//     switch (choice) {
//       case "1":
//         // await AddFriend();
//         break;
//       case "2":
//         // showFriends();
//         break;
//       case "3":
//         console.log("Thank you, Goodbye!");
//         rl.close();
//         return;
//     }
//   }
// };

// run();
