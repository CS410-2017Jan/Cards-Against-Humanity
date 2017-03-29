import {LeaderboardFacade} from "./leaderboard-facade";
import {User} from "../../data-classes/user";

let leaderboardFacde;

describe('RoomFacade Tests', () => {

  beforeAll(() => {
    leaderboardFacde = new LeaderboardFacade();
  });

  it('users should be ordered by score', () => {
    leaderboardFacde.getScores(function (users: Array<User>) {
      expect(users[0]).toBeGreaterThan(users[1]);
    });
  });
});
