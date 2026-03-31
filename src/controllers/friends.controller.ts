import type { Friend } from "../models/friend.model.js";
import { FriendsRepository } from "../repositories/friends.repository.js";
export class FriendsController {
  checkEmailExists(email: string) {
    return false;
  }

  checkPhoneExists(phone: string) {
    return false;
  }

  addFriend(friend: Friend) {
    //isemail is present ,is phnenumebr is present
    if (!FriendsRepository) console.log("Adding friend to database...", friend);
  }
}
