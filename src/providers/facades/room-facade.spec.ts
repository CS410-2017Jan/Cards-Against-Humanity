import {RoomFacade} from "./room-facade";
import {Room} from "../../data-classes/room";
import {UserFacade} from "./user-facade";
import {User} from "../../data-classes/user";
import {RoomWebService} from "../web-services/room-web-service";

let roomFacade;
let userFacade;
let privateRoom;
let publicRoom;

describe('RoomFacade Tests', () => {

  beforeAll((done) => {
    roomFacade = new RoomFacade();
    userFacade = new UserFacade();
    userFacade.logInUser('sonalee@gmail.com', 'sonalee123', function (bool: boolean) {
      if (bool) {
        var user = userFacade.getLoggedInUser();
        roomFacade.createRoom('NPM Test', user, true, function (room: Room) {
          privateRoom = room;
          done();
        }, 3, 'password');
      }
    });
  });

  it('Test: Room should contain user', () => {
    expect(privateRoom.users[0].username).toBe("sonalee123");
  });

  it('Test: get local Room', () => {
    var currRoom = roomFacade.getCurrentRoom();
    expect(currRoom.id).toBe(privateRoom.id);
  });

  it('Test: get room with id', (done) => {
    roomFacade.getRoom(privateRoom.id, function (room: Room) {
      expect(room.id).toBe(privateRoom.id) &&
      expect(room.name).toBe(privateRoom.name) &&
      expect(room.password).toBe(privateRoom.password);
      done();
    });
  });

  it('Test: should get all open rooms', (done) => {
    roomFacade.getOpenRooms(function (rooms: Array<Room>) {
      for (var room of rooms) {
        expect(room.users.length).toBeLessThan(room.size);
      }
      done();
    });
  });

  it('Test: attempt password should work', () => {
    var bool = roomFacade.attemptRoomPassword(privateRoom, 'password');
    expect(bool).toBeTruthy();
  });

  it('Test: should be able to join room', (done) => {
    var newUser = new User('scott123', '-KfyM1OTOVIR375EYMr3', 'scott@gmail.com', 10, undefined);
    roomFacade.joinRoom(privateRoom, newUser, function (room: Room) {
      expect(room.users).toContain(newUser);
      done();
    });
  });

  it('Test: should contain all users (2)', (done) => {
    roomFacade.getUsersInRoom(privateRoom.id, function (users: Array<User>) {
      expect(users.length).toBe(2);
      expect(privateRoom.users).toContain(users[0]);
      expect(privateRoom.users).toContain(users[1]);
      done();
    });
  });

  it('Test: should delete a user', (done) => {
    console.log('failing test');
    var toDelete = new User('scott123', '-KfyM1OTOVIR375EYMr3', 'scott@gmail.com', 10, undefined);
    roomFacade.removeUser(privateRoom, toDelete, function (room: Room) {
      console.log('removing', room.users);
      expect(room.users.length).toBe(1);
      expect(privateRoom.users).not.toContain(toDelete);
      done();
    });
  });

  it('Test: should create private room', function (done) {
    var user = new User('scott123', '-KfyM1OTOVIR375EYMr3', 'scott@gmail.com', 10, undefined);
    roomFacade.createRoom('NPM Test Private', user, false, function (room: Room) {
      publicRoom = room;
      expect(room.isLocked).toBeFalsy();
      done();
    }, 3, undefined);
  });

  afterAll((done) => {
    var rws = new RoomWebService();
    rws.deleteRoom(publicRoom.id);
    rws.deleteRoom(privateRoom.id);
    done();
  });

});
