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

  searchFriends(query: string, pageOptions?: PageOptions): PageResult<Friend> {
    const lowerQuery = query.toLowerCase();
    const filtered = this.friends.filter((friend) => {
      friend.name.toLowerCase().includes(lowerQuery) ||
        friend.email?.toLowerCase().includes(lowerQuery) ||
        friend.phone?.toLowerCase().includes(lowerQuery);
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
}
