import type { Friend } from "../models/friend.model.ts";
import type { PageOptions, PageResult } from "../core/pagination.types.ts";
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

  updateFriend(id: string) {
    const friend = this.findFriendById(id);
    if (friend) {
      console.log(`Friend with id ${id} not exist in the friend list`);
      return;
    }
    return friend;
  }
}
