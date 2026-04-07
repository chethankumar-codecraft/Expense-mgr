import type { Friend } from "../models/friend.model.js";
import { FriendsController } from "../controllers/friends.controller.js";
import { emailValidator } from "../core/validators/email.validator.js";
import { phoneValidator } from "../core/validators/phone.validator.js";
import { type Choice, openInterractionManager } from "./interaction-manager.js";
import { numberValidator } from "../core/validators/number.validator.js";
import { notEmpty } from "../core/validators/notemptyString.validator.js";
import { ConflictError } from "../core/errors/conflict.error.js";
import { DBconnection } from "../core/errors/DBconnection.error.js";
import { displayTable } from "../core/consts/displayTable.js";
import { rangeValidator } from "../core/validators/range.validator.js";
import { yesOrNo } from "../core/validators/yesOrNo.validator.js";
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
  const friendFormData: Friend = {
    id: Date.now().toString(),
    name: "",
    email: "",
    phone: "",
    balance: null,
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
        friendFormData.email = await ask(`Enter friend's email :`, {
          validator: emailValidator,
          defaultAnswer: null,
        });
      }
      if (friendFormData.phone === "") {
        friendFormData.phone = await ask(`Enter friend's phone number :`, {
          validator: phoneValidator,
          defaultAnswer: null,
        });
      }
      if (friendFormData.balance === null) {
        friendFormData.balance = Number(
          await ask(
            `Enter the initial balance (+ve means they owe you, -ve means you owe them) :`,
            { validator: numberValidator, defaultAnswer: "0" },
          ),
        );
      }
      if (friendFormData.address === "") {
        friendFormData.address = await ask(
          "Enter the address of your friend: ",
          {
            defaultAnswer: null,
          },
        );
      }

      friendController.addFriend(friendFormData);
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

    displayTable(list.data);
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

  const existingFriend = friendController.updateFriend(personIdOrName!); // just fetch

  const formData: Friend = {
    ...existingFriend,
  };

  const showUpdateForm = async () => {
    try {
      console.log("Press Enter to keep old value:");

      formData.name =
        (await ask(`Enter friend's name :`, {
          defaultAnswer: existingFriend.name,
        })) || existingFriend.name;

      formData.email =
        (await ask(`Enter friend's email :`, {
          validator: emailValidator,
          defaultAnswer: existingFriend.email,
        })) || existingFriend.email;

      formData.phone =
        (await ask(`Enter friend's phone number :`, {
          validator: phoneValidator,
          defaultAnswer: existingFriend.phone,
        })) || existingFriend.phone;

      if (formData.balance === null || formData.balance === undefined) {
        formData.balance = Number(
          (await ask(`Enter balance :`, {
            validator: numberValidator,
            defaultAnswer: String(existingFriend.balance),
          })) || existingFriend.balance,
        );
      }

      formData.address =
        (await ask(`Enter address :`, {
          defaultAnswer: existingFriend.address,
        })) || existingFriend.address;
      const result = friendController.updateFriend(personIdOrName!, formData);

      console.log(`Updated ${result.name}`);
      console.table(result);
    } catch (err) {
      if (err instanceof ConflictError) {
        console.log(`${err.message}`);
        console.log(`Conflict fields: ${err.conflictProperties.join(", ")}`);

        err.conflictProperties.forEach((field) => {
          if (field === "balance") {
            formData.balance = null as any;
          } else {
            formData[field as keyof Friend] = "" as any;
          }
        });

        return await showUpdateForm();
      }

      console.error(err);
    }
  };

  return await showUpdateForm();
};

export const removeFriend = async () => {
  const input = await ask(`Enter the friend ID OR name to remove: `, {
    validator: notEmpty,
  });
  // Search for all possible matches
  const matches = friendController.searchFriend(input!, {
    offset: 0,
    limit: 100,
  });

  if (!matches || matches.matched === 0) {
    console.error("No friend found with that ID or name.");
    return;
  }

  let selectedFriend: Friend;
  if (matches.matched === 1) {
    selectedFriend = matches.data[0]!;
  } else {
    console.log("Multiple friends found. Select the correct one:");
    displayTable(matches.data);
    const indexStr = await ask(
      `Choose the friend by 'Entry' whom you want to delete: `,
      {
        validator: rangeValidator(1, matches.matched),
      },
    );
    const index = Number(indexStr) - 1; // subtract 1 because table shows 1-based index
    selectedFriend = matches.data[index]!;
  }
  console.log(`${selectedFriend.name}'s Balance: ${selectedFriend.balance}`);
  if (selectedFriend.balance === 0)
    console.log(`No transaction is pending with this freind`);
  else console.error(`Warning: You cannot delete this friend.`);
  // Always ask confirmation before deletion
  const confirm = await ask(
    `Are you sure you want to delete ${selectedFriend.name}? (y/n) :`,
    { validator: yesOrNo },
  );

  if (confirm!.toLowerCase() !== "y") {
    console.log("Deletion cancelled.");
    return;
  }

  try {
    await friendController.removeFriend(selectedFriend.id);

    console.log(`${selectedFriend.name} deleted.`);
    displayTable([selectedFriend]);
  } catch (err) {
    if (err instanceof ConflictError) console.error(err.message);
    else throw err;
  }
};

export const manageFreinds = async () => {
  while (true) {
    const choice = await choose("\n\nWhat do you want to do?", options, false);

    switch (choice!.value) {
      case "1":
        console.log("Adding friend...\n");
        await addFriend();
        break;
      case "2":
        console.log("Searching friend...\n");
        await searchFriend();
        break;
      case "3":
        console.log("Updating friend...\n");
        await updateFriend();
        break;
      case "4":
        console.log("Removing friend...\n");
        await removeFriend();
        break;
      case "5":
        console.log("Exiting...\n");
        close();
        return;
    }
  }
};
