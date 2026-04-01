import type { Friend } from "../models/friend.model.js";
import type { PageOptions, PageResult } from "../core/pagination.types.js";
export class FriendsRepository {
  private static instance: FriendsRepository;
  private friends: Friend[] = [];

  static getInstance() {
    if (!FriendsRepository.instance)
      FriendsRepository.instance = new FriendsRepository();

    return FriendsRepository.instance;
  }

  private constructor() {}

  addFriend(friend: Friend) {
    this.friends.push(friend);
    console.log("Friend added to repository");
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
      console.log(
        `Friend with id or Name ${personIdOrName} not exist in the friend list`,
      );
      return;
    }
    if (!updatedDetails) return friendObj;
    friendObj.name = updatedDetails.name;
    friendObj.balance = updatedDetails.balance;
    friendObj.email = updatedDetails.email;
    friendObj.id = updatedDetails.id;
    friendObj.phone = updatedDetails.phone;
    return friendObj;
  }

  removeFriend(personIdOrName: string, forcible: boolean) {
    const removePerson =
      this.findFriendById(personIdOrName) ||
      this.findFriendByName(personIdOrName);
    if (!removePerson) {
      console.log(
        `Friend with id or Name ${personIdOrName} not exist in the friend list`,
      );
      return;
    }
    if (removePerson.balance !== 0 && !forcible) {
      console.log(`You cannot delete this person before settlement`);
    } else {
      this.friends = this.friends.filter((friend) => {
        return friend.id !== personIdOrName && friend.name !== personIdOrName;
      });
    }
    return removePerson;
  }
}
