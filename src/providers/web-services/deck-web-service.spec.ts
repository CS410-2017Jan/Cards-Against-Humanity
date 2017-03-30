import {DeckWebService} from "./deck-web-service";
import {Deck} from "../../data-classes/deck";


describe('Service- Deck Web Service', () => {

	let testDeck: Deck;
	let testDecks: Deck[];
	let ws: DeckWebService;

	beforeEach((done) => {
		ws = new DeckWebService();
		ws.getDeck("-KdfzixNq1S7IF_LGlCj", function(d: Deck){
			//console.log("Got deck");
			//console.log(d);
			testDeck = d;
			ws.getDecksByIDList(["-KdfzixNq1S7IF_LGlCj", "-KdfzixNq1S7IF_LGlCj","-KdfzixNq1S7IF_LGlCj"], function(ds: Deck[]){
				testDecks = ds;
				done();
			})
		});
  	});

  	it('Deck is correctly retrieved', () => {
  		//console.log("Testing decks");
  		//console.log(testDeck)
  		// Check that all white cards are got
		expect(testDeck.whiteCards.length).toBe(460);
		// Check a "random" white card for correctness
		expect(testDeck.whiteCards[120].content).toBe("A zesty breakfast burrito.");
		expect(testDeck.whiteCards[120].type).toBe('white');
		// Check that all black cards are got
		expect(testDeck.blackCards.length).toBe(76);
		// Check a random black card for correctness
		expect(testDeck.blackCards[5].content).toBe("What is Batman's guilty pleasure?");
		expect(testDeck.blackCards[5].type).toBe('black');
  	});
  	it('Decks are correctly retrieved', () => {
  		// Repeat the single deck tests on the second and third in the list (gets the same deck 3 times)

  		// Check that all white cards are got
		expect(testDecks[1].whiteCards.length).toBe(460);
		// Check a "random" white card for correctness
		expect(testDecks[1].whiteCards[120].content).toBe("A zesty breakfast burrito.");
		expect(testDecks[1].whiteCards[120].type).toBe('white');
		// Check that all black cards are got
		expect(testDecks[1].blackCards.length).toBe(76);
		// Check a random black card for correctness
		expect(testDecks[1].blackCards[5].content).toBe("What is Batman's guilty pleasure?");
		expect(testDecks[1].blackCards[5].type).toBe('black');

		// Check that all white cards are got
		expect(testDecks[2].whiteCards.length).toBe(460);
		// Check a "random" white card for correctness
		expect(testDecks[2].whiteCards[120].content).toBe("A zesty breakfast burrito.");
		expect(testDecks[2].whiteCards[120].type).toBe('white');
		// Check that all black cards are got
		expect(testDecks[2].blackCards.length).toBe(76);
		// Check a random black card for correctness
		expect(testDecks[2].blackCards[5].content).toBe("What is Batman's guilty pleasure?");
		expect(testDecks[2].blackCards[5].type).toBe('black');
  	})


})