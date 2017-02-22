/**
 * Created by Joshua Jackson on 21-Feb-17.
 */

type MsgCodes = 'PLAY_WHITE_CARD' |
                'PLAY_BLACK_CARD' |
                'PICK_WINNING_CARD' |
                'REQUEST_CONTINUE';

export class PubNubMsg {
  code;
  content;

  constructor(code: MsgCodes, content: string) {
    this.code = code;
    this.content = content;
  }
}
