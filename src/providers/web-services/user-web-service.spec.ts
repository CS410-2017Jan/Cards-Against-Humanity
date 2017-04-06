import {UserWebService} from "./user-web-service";
import {User} from "../../data-classes/user";

describe('Service- User Web Service Create User Functionality', () => {

  // NOTE- THIS SHOULD ALWAYS BE FALSE UNLESS YOU ARE SPECICALLY TESTING CREATEUSER
  let doCreateUserTest = false;

  let promises: Promise<void>[] = [];
  let newUser: User;
  let newUserUsername;
  let newUserPassword = "abcdefg1234567";
  let newUserEmail;
  let ws: UserWebService;

  beforeEach((done) => {
    // Do all the promises
    ws = new UserWebService();
    // check if we are doing createUser test
        if(doCreateUserTest){
          // init the username and email to something random
          let randInt = Math.floor(Math.random() * (1000000000));
          newUserEmail = "testUser" + randInt + "@gmail.com";
          newUserUsername = "testUser" + randInt;

          promises.push(new Promise(function (resolve, reject) {
           // add the new picture
           ws.createUser(newUserUsername, newUserPassword, newUserEmail, id => {
             // get the user
             ws.getUser(id, u => {
              resolve(u);
              });
           });
          }).then(function (result) {
           newUser = <User> result;
          }))
        }
    // Wait for them all to return before calling Done
    Promise.all(promises).then(function(result){

          done();
        });
  })

  // Test for create user, auto-passes if turned off
    it('Ensure user is created (auto-passes if disabled)', () => {
      if(doCreateUserTest){
        // check that the retrieved new user had fields created properly
        expect(newUser.email).toBe(newUserEmail);
        expect(newUser.username).toBe(newUserUsername);
        expect(newUser.score).toBe(0);
        expect(newUser.base64Image).toBe('');
      }
      else{
        expect(true).toBe(true);
      }
    })

})

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

	let testUserID: string = "-KgqDUDWnBpnf978TjAJ";
	let testUserEmail: string = "thomas@gmail.com";
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
  		expect(testUser.username).toBe("thomas123");
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
  		expect(foundUser.username).toBe("thomas123");
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
  		expect(usersGottenByID[1].username).toBe("thomas123");
  		expect(usersGottenByID[1].id).toBe(testUserID);
  		expect(usersGottenByID[1].email).toBe(testUserEmail);
  		expect(usersGottenByID[1].score).toBeGreaterThan(-1);
  		expect(usersGottenByID[2].username).toBe("thomas123");
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
