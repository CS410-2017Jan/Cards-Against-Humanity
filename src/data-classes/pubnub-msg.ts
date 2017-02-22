/**
 * Created by Joshua Jackson on 21-Feb-17.
 */

export class PubNubMsg {
  code;
  content;

  constructor(code: string, content: string) {
    this.code = code;
    this.content = content;
  }

}
