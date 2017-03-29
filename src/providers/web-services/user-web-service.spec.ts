import {UserWebService} from "./user-web-service";
import {User} from "../../data-classes/user";



describe('Service- User Web Service Basic Functionality', () => {

	let testUser: User;
	let testUsers: User[];
	let testAllUsers: User[];
	let ws: UserWebService;
	let promises: Promise<void>[] = [];
	let preScore;
	let postScore;
	let retrievedProfilePicture: string;
	let userGottenByEmail: User;
	let usersGottenByID: User[];

	let testUserID: string = "-KgNcUbFHI_NX7Ic7R-G";
	let testUserEmail: string = "testsuiteuser@gmail.com";
	let profilePicture: string = "THIS_IS_NOT_A_REAL_PROFILE_PICTURE_ITS_JUST_FOR_TESTING";

	beforeEach((done) => {
		// Do all the promises
		ws = new UserWebService();
		
		// getUser()
		promises.push(new Promise(function (resolve, reject) {
           ws.getUser(testUserID, u => {
            resolve(u)
           });
        }).then(function (result) {
           testUser = <User> result;

           preScore = testUser.score;
        }))

		// getAllUsers()
		promises.push(new Promise(function (resolve, reject) {
           ws.getAllUsers(u => {
            resolve(u)
           });
        }).then(function (result) {
           testAllUsers = <User[]> result;
        }))

        // addScore()
        promises.push(new Promise(function (resolve, reject) {
           // add the score
           ws.addScore(testUserID, 2, i => {
             // get the new score
             ws.getUser(testUserID, u => {
            	resolve(u.score);
           	 });
           });
        }).then(function (result) {
           postScore = result;
        }))

        // profile picture
        promises.push(new Promise(function (resolve, reject) {
           // add the new picture
           ws.addProfilePicture(testUserID, profilePicture, b => {
             // get the new profile picture
             ws.getProfilePicture(testUserID, s => {
            	resolve(s);
           	 });
           });
        }).then(function (result) {
           retrievedProfilePicture = <string> result;
        }))

        // get user by email
        promises.push(new Promise(function (resolve, reject) {
           ws.getUserByEmail(testUserEmail, u => {
            resolve(u)
           });
        }).then(function (result) {
           userGottenByEmail = <User> result;
        }))

        // get users by ID's
        promises.push(new Promise(function (resolve, reject) {
           ws.getUsersByIDList([testUserID, testUserID, testUserID], u => {
            resolve(u)
           });
        }).then(function (result) {
           usersGottenByID = <User[]> result;
        }))

		// Wait for them all to return before calling Done
		Promise.all(promises).then(function(result){
			
        	done();
      	});
  	});

  	it('User is correctly retrieved', () => {
  		// Go through the fields
  		expect(testUser.username).toBe("dontdeleteme");
  		expect(testUser.id).toBe(testUserID);
  		expect(testUser.email).toBe(testUserEmail);
  		expect(testUser.score).toBeGreaterThan(-1);
  	})

  	it('All users are correctly retrieved', () => {
  		// Find our test user inside
  		let foundUser: User = undefined;
  		for(let id in testAllUsers){
  			if(testAllUsers[id].id == testUserID){
  				foundUser = testAllUsers[id];
  			}
  		}
  		// check them out
  		expect(foundUser == undefined).toBeFalsy();
  		expect(foundUser.username).toBe("dontdeleteme");
  		expect(foundUser.id).toBe(testUserID);
  		expect(foundUser.email).toBe(testUserEmail);
  		expect(foundUser.score).toBeGreaterThan(-1);
  	})

  	it('Score is successfully updated for User', () => {
  		// just check old score vs new score
  		expect(preScore + 2).toBe(postScore);
  	})

  	it('Profile Picture is successfully added and retrieved', () => {
  		expect(retrievedProfilePicture).toContain(profilePicture);
  	})

  	it('User is gotten by email correctly', () => {
  		expect(userGottenByEmail.id).toBe(testUser.id);
  	})

  	it('Set of users gotten by ID is retrieved correctly', () => {
  		// repeat the single user check on the second and third in the list
  		expect(usersGottenByID[1].username).toBe("dontdeleteme");
  		expect(usersGottenByID[1].id).toBe(testUserID);
  		expect(usersGottenByID[1].email).toBe(testUserEmail);
  		expect(usersGottenByID[1].score).toBeGreaterThan(-1);
  		expect(usersGottenByID[2].username).toBe("dontdeleteme");
  		expect(usersGottenByID[2].id).toBe(testUserID);
  		expect(usersGottenByID[2].email).toBe(testUserEmail);
  		expect(usersGottenByID[2].score).toBeGreaterThan(-1);
  	})

  	// Stub tests for changeEmail and changePassword
  	it('Change username and password (stub)', () => {
  		ws.updatePassword("","",function(b: boolean){});
  		ws.updateEmail("","",function(b: boolean){});
  		expect(true).toBe(true);
  	})




})