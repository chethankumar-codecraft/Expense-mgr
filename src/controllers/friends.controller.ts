import type { Friend } from "../models/friend.model.js";
import { FriendsRepository } from "../repositories/friends.repository.js";
import { type PageOptions } from "../core/pagination.types.js";
import { ConflictError } from "../core/errors/conflict.error.js";
import { DBconnection } from "../core/errors/DBconnection.error.js";
import { displayTable } from "../core/consts/displayTable.js";
export class FriendsController {
  private repo = FriendsRepository.getInstance();
  checkEmailExists(email: string) {
    return this.repo.findFriendByEmail(email) !== undefined;
  }
  checkPhoneExists(phone: string) {
    return this.repo.findFriendByPhone(phone) !== undefined;
  }
  checkNameExists(name: string) {
    return this.repo.findFriendByName(name) !== undefined;
  }
  checkIdExists(id: string) {
    return this.repo.findFriendById(id) !== undefined;
  }

  addFriend(friend: Friend) {
    const sameDataExist = [];
    if (friend.email) {
      if (this.checkEmailExists(friend.email)) {
        sameDataExist.push("email");
      }
    }
    if (friend.phone) {
      if (this.checkPhoneExists(friend.phone)) {
        sameDataExist.push("phone");
      }
    }

    // isemail is present ,is phnenumebr is present
    if (sameDataExist.length !== 0) {
      throw new ConflictError(
        sameDataExist,
        "User already exist in these property",
      );
    }

    console.log("Adding friend to database...\n");
    displayTable([friend]);
    this.repo.addFriend(friend);
  }

  //searchcon
  searchFriend(input: string, pageOptions: PageOptions) {
    if (!this.repo) {
      throw new DBconnection(
        " Searching friend failed : FriendsRepository not initialized. Ensure database connection is active.",
      );
    }
    console.log("Searching friend in database...", input);
    return this.repo.searchFriends(input, pageOptions);
  }

  //update
  updateFriend(personIdOrName: string, updatedDetail?: Friend) {
    if (!this.repo) {
      throw new DBconnection(
        "Updating friend detail Failed : FriendsRepository not initialized. Ensure database connection is active.",
      );
    }
    console.log("Updating friend deatils in database...", personIdOrName);
    try {
      return this.repo.updateFriend(personIdOrName, updatedDetail);
    } catch (err) {
      if (err instanceof ConflictError) {
        throw new ConflictError(err.conflictProperties, "Update failed");
      }
      throw err;
    }
  }

  //remove
  async removeFriend(id: string) {
    if (!this.repo) {
      throw new DBconnection(
        "Deleting friend detail Failed : FriendsRepository not initialized. Ensure database connection is active.",
      );
    }
    try {
      return this.repo.removeFriend(id);
    } catch (err) {
      throw err;
    }
  }
}
