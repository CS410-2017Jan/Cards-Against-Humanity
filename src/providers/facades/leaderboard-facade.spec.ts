import {LeaderboardFacade} from "./leaderboard-facade";
import {User} from "../../data-classes/user";

let leaderboardFacade;

describe('Leaderboard Facade Tests', () => {

  beforeAll(() => {
    leaderboardFacade = new LeaderboardFacade();
  });

  it('users should be ordered by score', () => {
    leaderboardFacade.getScores(function (users: Array<User>) {
      expect(users[0].score).toBeGreaterThan(users[1].score);
    });
  });
});
