import type { Friend } from "../models/friend.model.ts";
import { FriendsRepository } from "../repositories/friends.repository.ts";
import { type PageOptions } from "../core/pagination.types.ts";
export class FriendsController {
  checkEmailExists(email: string) {
    if (FriendsRepository.getInstance().findFriendByEmail(email)) return false; //not already exist
    return true;
  }

  checkPhoneExists(phone: string) {
    if (FriendsRepository.getInstance().findFriendByPhone(phone)) return false; //not already exist
    return true;
  }

  addFriend(friend: Friend) {
    if (friend.email) {
      if (!this.checkEmailExists(friend.email)) {
        console.log(
          `Friend with email${friend.email} is already exist in your friend list`,
        );
        return;
      }
    }
    if (friend.phone) {
      if (!this.checkPhoneExists(friend.phone)) {
        console.log(
          `Friend with phone number${friend.phone} is already exist in your friend list`,
        );
        return;
      }
    }

    // isemail is present ,is phnenumebr is present
    if (!FriendsRepository.getInstance()) {
      console.log("Adding friend Failed");
      return;
    }
    console.log("Adding friend to database...", friend);
    FriendsRepository.getInstance().addFriend(friend);
  }

  //search
  searchFriend(input: string, pageOptions: PageOptions) {
    if (!FriendsRepository.getInstance()) {
      console.log("Searching friend Failed");
      return;
    }
    console.log("Searching friend in database...", input);
    return FriendsRepository.getInstance().searchFriends(input, pageOptions);
  }

  //update
  updateFriend(id: string) {
    if (!FriendsRepository.getInstance()) {
      console.log("Updating friend detail Failed");
      return;
    }
    console.log("Updating friend deatils in database...", id);
    return FriendsRepository.getInstance().updateFriend(id);
  }
}
