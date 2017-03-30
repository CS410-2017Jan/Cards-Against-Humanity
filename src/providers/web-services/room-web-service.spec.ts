import {RoomWebService} from "./room-web-service";
import {Room} from "../../data-classes/room";
import {UserWebService} from "./user-web-service";



describe('Service- Room Web Service', () => {

  let ws: RoomWebService;
  let uws: UserWebService;
  let promises: Promise<void>[] = [];
	let testRoom: Room;

	let testRoomID: string = "-KfoLPPlDyLyLl_Qt8hm";
  let newRoomName: string = "TESTROOMSHOULDBEDELETED";
  let newRoomDecks: string[] = ["-KdfzixNq1S7IF_LGlCj"];
  let newRoomPassword: string = "sdsadsadasdasdas";
  let newRoomUser: string = "-KgO-2jkFkabf5hGBZET";
  let newRoomSize = 3;
  let newRoom: Room;

	beforeEach((done) => {
		// Do all the promises
		ws = new RoomWebService();
    uws = new UserWebService();
		
		// getRoom()
		promises.push(new Promise(function (resolve, reject) {
           ws.getRoom(testRoomID, r => {
            resolve(r)
           });
        }).then(function (result) {
           testRoom = <Room> result;
        }))

    // createRoom()
    // log in 
    promises.push(new Promise(function (resolve, reject) {
      uws.logInUser("testsuiteuser@gmail.com", "testtest", u => {
        resolve(u)
      });
    }).then(function (result) {
        promises.push(new Promise(function (resolve, reject) {
           // add the new picture
           ws.createRoom(newRoomName, newRoomDecks, newRoomUser,  rID => {
             // get the new profile picture
             console.log(rID);
             ws.getRoom(rID, r => {
              ws.deleteRoom(rID);
              resolve(r);
              });
           }, newRoomPassword, newRoomSize);
        }).then(function (result) {
           newRoom = <Room> result;

    }))
    }))

    

		

		// Wait for them all to return before calling Done
		Promise.all(promises).then(function(result){
			
        	done();
      	});
  	});

  	it('Room is correctly retrieved', () => {
  		expect(testRoom.name).toBe("Master Test Room: Don't Delete");
      expect(testRoom.isLocked).toBe(true);
  		
  	})

    it('New Room is correct', () => {
      expect(newRoom.name).toBe(newRoomName);
      expect(newRoom.password).toBe(newRoomPassword);
      expect(newRoom.size).toBe(newRoomSize);
      expect(newRoom.isLocked).toBe(true);
    })





})