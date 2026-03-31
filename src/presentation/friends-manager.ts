import type { Choice } from "./interaction-manager.js";
import { openInterractionManager } from "./interaction-manager.js";
const options: Choice[] = [
  { label: "Add Friend", value: "1" },
  { label: "Search Friend", value: "2" },
  { label: "Update", value: "3" },
  { label: "Remove Friend", value: "4" },
  { label: "Exit", value: "5" },
];

const { ask, choose, close } = openInterractionManager();

const AddFriend = async () => {
  const name = await ask(`Enter friend's name:`);
  const email = await ask(`Enter friend's name:`);
  const phone = await ask(`Enter friend's name:`);
};

export const manageFreinds = async () => {
  while (true) {
    const choice = await choose("What do you want to do?", options, false);

    switch (choice!.value) {
      case "1":
        console.log("Adding friend..");
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
        close;
        break;
    }
  }
};
