import type { Friend } from "../models/friend.model.js";
import { FriendsController } from "../controllers/friends.controller.js";
import { emailValidator } from "../core/validators/email.validator.js";
import { phoneValidator } from "../core/validators/phone.validator.js";
import { type Choice, openInterractionManager } from "./interaction-manager.js";
import { numberValidator } from "../core/validators/number.validator.js";
import { notEmpty } from "../core/validators/notemptyString.validator.js";
import { ConflictError } from "../core/errors/conflict.error.js";
import { DBconnection } from "../core/errors/DBconnection.error.js";
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
  const friendFormData = {
    id: Date.now().toString(),
    name: "",
    email: "",
    phone: "",
    balance: null as number | null,
    address: "",
  };

  const showFriendForm = async () => {
    try {
      if (friendFormData.name === "") {
        friendFormData.name =
          (await ask(`Enter friend's name :`, {
            defaultAnswer: "",
            validator: notEmpty,
          })) || "";
      }
      if (friendFormData.email === "") {
        friendFormData.email =
          (await ask(`Enter friend's email :`, {
            validator: emailValidator,
            defaultAnswer: "",
          })) || "";
      }
      if (friendFormData.phone === "") {
        friendFormData.phone =
          (await ask(`Enter friend's phone number :`, {
            validator: phoneValidator,
            defaultAnswer: "",
          })) || "";
      }
      if (friendFormData.balance === null) {
        friendFormData.balance =
          Number(
            await ask(
              `Enter the initial balance (+ve means they owe you, -ve means you owe them) :`,
              { validator: numberValidator, defaultAnswer: "0" },
            ),
          ) || 0;
      }
      if (friendFormData.address === "") {
        friendFormData.address =
          (await ask("Enter the address of your friend: ", {
            defaultAnswer: "",
          })) || "";
      }

      friendController.addFriend(friendFormData as Friend);
    } catch (err) {
      if (err instanceof ConflictError) {
        console.log(`${err.conflictMessage} :`, err.conflictProperties);
        err.conflictProperties.forEach((field) => {
          if (field === "balance") {
            friendFormData.balance = null;
          } else {
            friendFormData[
              field as Exclude<keyof typeof friendFormData, "balance">
            ] = "";
          }
        });
        await showFriendForm();
      } else if (err instanceof DBconnection) {
        console.error(err);
      } else {
        throw err;
      }
    }
  };
  return await showFriendForm();
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
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(list.matched / limit);

    console.log(`Page: ${currentPage} / ${totalPages}`);
    const navigation: Choice[] = [
      { label: "NEXT", value: "1" },
      { label: "PREV", value: "2" },
      { label: "GO TO HOME PAGE", value: "3" },
    ];
    const navTo = await choose(`What do you want to do?`, navigation, false);
    switch (navTo?.value) {
      case "1": {
        if (offset + limit < list.matched) {
          offset += limit;
        }
        break;
      }
      case "2": {
        offset = Math.max(offset - limit, 0);
        break;
      }
      case "3": {
        return;
      }
    }
  }
};

const updateFriend = async () => {
  const personIdOrName = await ask(`Enter the friend ID OR name to update: `, {
    validator: notEmpty,
  });

  const friend = friendController.updateFriend(personIdOrName!);
  if (!friend) return;

  console.log("Just Press Enter if you don't want to  edit :");
  const name = await ask(`Enter friend's name :`, {
    defaultAnswer: friend.name,
  });
  const email = await ask(`Enter friend's email :`, {
    validator: emailValidator,
    defaultAnswer: friend.email,
  });
  const phone = await ask(`Enter friend's phone number :`, {
    validator: phoneValidator,
    defaultAnswer: friend.phone,
  });
  const balance = await ask(
    `Enter the initial balance (+ve means they owe you, -ve means you owe them) :`,
    { validator: numberValidator, defaultAnswer: String(friend.balance) },
  );

  const address = await ask("Enter the address of your friend: ", {
    defaultAnswer: friend.address,
  });
  const updatedDetail: Friend = {
    id: friend.id,
    name: name!,
    email: email!,
    phone: phone!,
    balance: Number(balance),
    address: address!,
  };

  const result = friendController.updateFriend(personIdOrName!, updatedDetail);
  console.log(`Updated the ${result?.name} Details:`);
  console.table(result);
};

const removeFriend = async () => {
  const personIdOrName = await ask(`Enter the friend ID OR name to update: `, {
    validator: notEmpty,
  });

  const result = friendController.removeFriend(personIdOrName!);
  if (result) {
    if (result.balance !== 0) {
      const confirm = await ask("Are you still want to delete? (y/n)");
      if (confirm === "y") friendController.removeFriend(personIdOrName!, true);
      else return;
    }
    console.table(result);
    console.log(`This User is deleted from the Friend list`);
    return;
  }
};

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
        await updateFriend();
        break;
      case "4":
        console.log("Removing friend..");
        await removeFriend();
        break;
      case "5":
        console.log("Exiting...");
        close();
        return;
    }
  }
};
