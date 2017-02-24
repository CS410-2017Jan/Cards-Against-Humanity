/**
 * Created by Joshua Jackson on 23-Feb-17.
 */

// ======================================================================
// This Class contains general TypeScript tools for use anywhere
// ======================================================================
export class Tools {
  // TypeScript and JavaScript pass objects and arrays by Reference. Which leads to some
  // interesting errors, especially when you pass it to a render function who passes it to angular...
  // Use this function to pass objects and arrays by Value.
  static clone(x) {
    return (JSON.parse(JSON.stringify(x)));
  }

  // returns true if given element is a member of the given array.
  static member(ele, array) : boolean {
  for(var i=0; i<array.length; i++) {
    if (array[i] == ele) return true;
  }
  return false;
}

  // TODO: add array remove and maybe member functions
}

