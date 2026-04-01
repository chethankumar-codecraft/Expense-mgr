import type { Friend } from "../models/friend.model.ts";
import { FriendsController } from "../controllers/friends.controller.ts";
import { emailValidator } from "../core/validators/email.validator.ts";
import { phoneValidator } from "../core/validators/phone.validator.ts";
import { type Choice, openInterractionManager } from "./interaction-manager.ts";
import { numberValidator } from "../core/validators/number.validator.ts";
import { notEmpty } from "../core/validators/notemptyString.validator.ts";
const options: Choice[] = [
  { label: "Add Friend", value: "1" },
  { label: "Search Friend", value: "2" },
  { label: "Update", value: "3" },
  { label: "Remove Friend", value: "4" },
  { label: "Exit", value: "5" },
];

const { ask, choose, close } = openInterractionManager();
const friendController = new FriendsController();
const addFriend = async () => {
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
    id: Date.now().toString(),
    name: name!,
    email: email,
    phone: phone,
    balance: Number(balance),
  };
  friendController.addFriend(friend);
};

const searchFriend = async () => {
  const searchDetail = await ask(
    `Enter the Friend's name OR phone number OR email to search`,
    { defaultAnswer: "" },
  );
  let offset = 0;
  let limit = 5;
  while (true) {
    const list = friendController.searchFriend(searchDetail!, {
      offset: offset,
      limit: limit,
    });
    if (!list) return;
    console.table(list.data);
    const navigation: Choice[] = [
      { label: "NEXT", value: "1" },
      { label: "PREV", value: "2" },
      { label: "GO TO HOME PAGE", value: "3" },
    ];
    const navTo = await choose(`What do you want to do?`, navigation, false);
    switch (navTo?.value) {
      case "1": {
        if (offset < list.matched - 5) offset += 5;
        if (limit < list.matched) limit += 5;
        friendController.searchFriend(searchDetail!, {
          offset: offset,
          limit: limit,
        });
        break;
      }
      case "2": {
        if (offset - 5 >= 0) offset -= 5;
        if (limit - 5 >= 5) limit -= 5;
        friendController.searchFriend(searchDetail!, {
          offset: offset,
          limit: limit,
        });
        break;
      }
      case "3": {
        return;
      }
    }
  }
};

// const updateFriend = async () => {
//   const updateBy: Choice[] = [
//     { label: "By ID", value: "1" },
//     { label: "By Name", value: "2" },
//     { label: "By Email", value: "3" },
//     { label: "By Phone number", value: "4" },
//     { label: "Cancel update", value: "5" },
//   ];
//   const updateChoice = await choose(
//     `How do you want to find the friend? :`,
//     updateBy,
//     false,
//   );
//   switch(updateChoice?.value)
//   {
//     case '1':
//   }

//   const friend = friendController.updateFriend(personId!);
// };
export const manageFreinds = async () => {
  while (true) {
    const choice = await choose("What do you want to do?", options, false);

    switch (choice!.value) {
      case "1":
        console.log("Adding friend..");
        await addFriend();
        break;
      case "2":
        console.log("Searching friend..");
        await searchFriend();
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
