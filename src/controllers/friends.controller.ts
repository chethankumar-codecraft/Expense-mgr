import type { Friend } from "../models/friend.model.js";
import { FriendsRepository } from "../repositories/friends.repository.js";
import { type PageOptions } from "../core/pagination.types.js";
import { ConflictError } from "../core/errors/conflict.error.js";
import { DBconnection } from "../core/errors/DBconnection.error.js";
export class FriendsController {
  checkEmailExists(email: string) {
    if (FriendsRepository.getInstance().findFriendByEmail(email)) return false; //not already exist
    return true;
  }

  checkPhoneExists(phone: string) {
    if (FriendsRepository.getInstance().findFriendByPhone(phone)) return false; //not already exist
    return true;
  }
  checkNameExists(name: string) {
    if (FriendsRepository.getInstance().findFriendByName(name)) return false; //not already exist
    return true;
  }

  addFriend(friend: Friend) {
    const sameDataExist = [];

    if (friend.name) {
      if (!this.checkNameExists(friend.name)) sameDataExist.push("name");
    }
    if (friend.email) {
      if (!this.checkEmailExists(friend.email)) {
        sameDataExist.push("email");
      }
    }
    if (friend.phone) {
      if (!this.checkPhoneExists(friend.phone)) {
        sameDataExist.push("phone");
      }
    }

    // isemail is present ,is phnenumebr is present
    if (!FriendsRepository.getInstance()) {
      throw new DBconnection(
        "Adding friend Failed: FriendsRepository not initialized. Ensure database connection is active.",
      );
    }
    if (sameDataExist.length !== 0) {
      throw new ConflictError(
        sameDataExist,
        "User already exist in these property",
      );
    }

    console.log("Adding friend to database...", friend);
    FriendsRepository.getInstance().addFriend(friend);
  }

  //searchcon
  searchFriend(input: string, pageOptions: PageOptions) {
    if (!FriendsRepository.getInstance()) {
      throw new DBconnection(
        " Searching friend failed : FriendsRepository not initialized. Ensure database connection is active.",
      );
    }
    console.log("Searching friend in database...", input);
    return FriendsRepository.getInstance().searchFriends(input, pageOptions);
  }

  //update
  updateFriend(personIdOrName: string, updatedDetail?: Friend) {
    if (!FriendsRepository.getInstance()) {
      throw new DBconnection(
        "Updating friend detail Failed : FriendsRepository not initialized. Ensure database connection is active.",
      );
    }
    console.log("Updating friend deatils in database...", personIdOrName);
    return FriendsRepository.getInstance().updateFriend(
      personIdOrName,
      updatedDetail,
    );
  }

  //remove
  removeFriend(personIdOrName: string, forcible: boolean = false) {
    if (!FriendsRepository.getInstance()) {
      throw new DBconnection(
        "Deleting friend detail Failed : FriendsRepository not initialized. Ensure database connection is active.",
      );
    }
    return FriendsRepository.getInstance().removeFriend(
      personIdOrName,
      forcible,
    );
  }
}
