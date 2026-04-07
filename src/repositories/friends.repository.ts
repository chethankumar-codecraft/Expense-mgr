import type { Friend } from "../models/friend.model.js";
import type { PageOptions, PageResult } from "../core/pagination.types.js";
import { AppDBManager } from "../models/db-manager.js";
import { ConflictError } from "../core/errors/conflict.error.js";
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

  updateFriend(personIdOrName: string, updatedDetails?: Friend) {
    const friendObj =
      this.findFriendById(personIdOrName) ||
      this.findFriendByName(personIdOrName);
    if (!friendObj) {
      throw new ConflictError(["personIdOrName"], `Friend not found`);
    }
    if (!updatedDetails) return friendObj;

    const sameDataExist: string[] = [];

    if (updatedDetails.name) {
      const exists = this.friends.find(
        (f) => f.name === updatedDetails.name && f.id !== friendObj.id, // exclude self
      );
      if (exists) sameDataExist.push("name");
    }
    if (updatedDetails.email) {
      const exists = this.friends.find(
        (f) => f.email === updatedDetails.email && f.id !== friendObj.id,
      );
      if (exists) sameDataExist.push("email");
    }

    if (updatedDetails.phone) {
      const exists = this.friends.find(
        (f) => f.phone === updatedDetails.phone && f.id !== friendObj.id,
      );
      if (exists) sameDataExist.push("phone");
    }
    if (sameDataExist.length !== 0) {
      throw new ConflictError(
        sameDataExist,
        "User already exists with these properties",
      );
    }

    if (!updatedDetails) return friendObj;
    friendObj.name = updatedDetails.name;
    friendObj.balance = updatedDetails.balance;
    friendObj.email = updatedDetails.email;
    friendObj.id = updatedDetails.id;
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
