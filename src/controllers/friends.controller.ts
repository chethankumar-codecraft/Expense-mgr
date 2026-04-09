import type { Friend } from "../models/friend.model.js";
import { FriendsRepository } from "../repositories/friends.repository.js";
import { type PageOptions } from "../core/pagination.types.js";
import { ConflictError } from "../core/errors/conflict.error.js";
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

    if (sameDataExist.length !== 0) {
      throw new ConflictError(
        sameDataExist,
        "User already exist in these property",
      );
    }

    console.log("Adding friend to database...\n");
    this.repo.addFriend(friend);
  }

  //searchcon
  searchFriend(input: string, pageOptions: PageOptions) {
    console.log("Searching friend in database...", input);
    return this.repo.searchFriends(input, pageOptions);
  }

  //update
  updateFriend(id: string, updatedDetail: Friend) {
    console.log("Updating friend deatils in database...", id);
    const friendObj = this.repo.findFriendById(id);
    if (!friendObj) {
      throw new ConflictError(["personIdOrName"], `Friend not found`);
    }
    const conflicts: string[] = [];

    if (
      updatedDetail.email &&
      this.checkEmailExists(updatedDetail.email) &&
      updatedDetail.email !== friendObj.email
    ) {
      conflicts.push("email");
    }
    if (
      updatedDetail.phone &&
      this.checkPhoneExists(updatedDetail.phone) &&
      updatedDetail.phone !== friendObj.phone
    ) {
      conflicts.push("phone");
    }

    if (conflicts.length > 0) {
      throw new ConflictError(conflicts, "These fields already exist");
    }
    return this.repo.updateFriend(friendObj, updatedDetail);
  }

  //remove
  async removeFriend(id: string) {
    return this.repo.removeFriend(id);
  }
}
