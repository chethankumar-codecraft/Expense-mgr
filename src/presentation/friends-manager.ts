import type { Friend } from "../models/friend.model.ts";
import { FriendsController } from "../controllers/friends.controller.ts";
import { emailValidator } from "../core/validators/email.validator.ts";
import { phoneValidator } from "../core/validators/phone.validator.ts";
import { type Choice, openInterractionManager } from "./interaction-manager.ts";
import { numberValidator } from "../core/validators/number.validator.ts";
const options: Choice[] = [
  { label: "Add Friend", value: "1" },
  { label: "Search Friend", value: "2" },
  { label: "Update", value: "3" },
  { label: "Remove Friend", value: "4" },
  { label: "Exit", value: "5" },
];

const { ask, choose, close } = openInterractionManager();

const AddFriend = async () => {
  const name = await ask(`Enter friend's name :`, {
    defaultAnswer: "newFriend",
  });
  const email = await ask(`Enter friend's email :`, {
    validator: emailValidator,
  });
  const phone = await ask(`Enter friend's phone number :`, {
    validator: phoneValidator,
  });
  const balance = await ask(
    `Enter the initial balance (+ve means they owe you, -ve means you owe them) :`,
    { validator: numberValidator, defaultAnswer: "0" },
  );

  const friend: Friend = {
    id: Date.now.toString(),
    name: name!,
    email: email,
    phone: phone,
    balance: Number(balance),
  };
  const friendController = new FriendsController();
  friendController.addFriend(friend);
};

export const manageFreinds = async () => {
  while (true) {
    const choice = await choose("What do you want to do?", options, false);

    switch (choice!.value) {
      case "1":
        console.log("Adding friend..");
        await AddFriend();
        break;
      case "2":
        console.log("Searching friend..");
        break;
      case "3":
        console.log("Updating friend..");
        break;
      case "4":
        console.log("Removing friend..");
        break;
      case "5":
        console.log("Exiting...");
        close();
        break;
    }
  }
};
