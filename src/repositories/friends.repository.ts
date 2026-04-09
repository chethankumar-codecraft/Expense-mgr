import type { Friend } from "../models/friend.model.js";
import type { PageOptions, PageResult } from "../core/pagination.types.js";
import { AppDBManager } from "../models/db-manager.js";
import { DBconnection } from "../core/errors/DBconnection.error.js";

export class FriendsRepository {
  private static instance: FriendsRepository;
  private friends: Friend[] = [];

  static getInstance() {
    if (!FriendsRepository.instance)
      FriendsRepository.instance = new FriendsRepository();

    return FriendsRepository.instance;
  }

  private constructor() {
    const db = AppDBManager.getInstance().getDB();
    if (!db) {
      throw new DBconnection("DB not initialized");
    }
    this.friends = db.table("friends") as Friend[];
  }

  findFriendByEmail(email: string) {
    return this.friends.find((friend) => friend.email === email);
  }
  findFriendByPhone(phone: string) {
    return this.friends.find((friend) => friend.phone === phone);
  }
  findFriendById(id: string) {
    return this.friends.find((friend) => friend.id === id);
  }
  findFriendByName(name: string) {
    return this.friends.find((friend) => friend.name === name);
  }

  addFriend(friend: Friend) {
    try {
      this.friends.push(friend);
      AppDBManager.getInstance().save();
      console.log(
        `${friend.name} is successffully added to  friends repository`,
      );
    } catch (err) {
      throw new DBconnection(
        "Adding friend Failed: FriendsRepository not initialized. Ensure database connection is active.",
      );
    }
  }

  searchFriends(query: string, pageOptions?: PageOptions): PageResult<Friend> {
    if (this.friends.length === 0) {
      console.log("No friends exists");
    }
    const lowerQuery = query.toLowerCase();
    const filtered = this.friends.filter((friend) => {
      return (
        friend.name.toLowerCase().includes(lowerQuery) ||
        friend.email?.toLowerCase().includes(lowerQuery) ||
        friend.phone?.toLowerCase().includes(lowerQuery)
      );
    });

    return {
      data: filtered.slice(
        pageOptions?.offset || 0,
        (pageOptions?.offset || 0) + (pageOptions?.limit || 5),
      ),
      matched: filtered.length,
      total: this.friends.length,
    };
  }

  updateFriend(friendObj: Friend, updatedDetails: Friend) {
    if (!updatedDetails) return friendObj;
    friendObj.name = updatedDetails.name;
    friendObj.balance = updatedDetails.balance;
    friendObj.email = updatedDetails.email;
    friendObj.phone = updatedDetails.phone;
    AppDBManager.getInstance().save();
    return friendObj;
  }

  removeFriend(id: string) {
    const index = this.friends.findIndex((f) => f.id === id);
    if (index === -1) return;
    const [removedPerson] = this.friends.splice(index, 1);
    AppDBManager.getInstance().save();
    return removedPerson;
  }
}
