/**
 * Created by Joshua Jackson on 21-Feb-17.
 */

type MsgCodes = 'JOINED' |
                'START_GAME' |
                'PLAY_WHITE_CARD' |
                'PLAY_BLACK_CARD' |
                'PICK_WINNING_CARD' |
                'REQUEST_CONTINUE' |
                'NEW_ROUND';

// ======================================================================
// This Class outlines the data structure/protocol of a PubNubMsg we use
// ======================================================================
export class PubNubMsg {
  code;
  content;

  constructor(code: MsgCodes, content: string) {
    this.code = code;
    this.content = content;
  }
}
