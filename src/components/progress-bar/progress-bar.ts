import { Component, Input } from '@angular/core';


//https://www.joshmorony.com/build-a-simple-progress-bar-component-in-ionic-2/
@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent {

  @Input('progress') progress;

  constructor() {

  }

}

