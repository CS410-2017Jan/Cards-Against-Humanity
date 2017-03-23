# Cards-Against-Humanity

**Setup Instructions:**
* Install WebStorm, Android Studio, Postman, Node.js, iTerm (Mac)
* In your general command line install ionic and update to lastest node/npm versions.
```
$ node -v
$ npm -v
$ npm install -g ionic
```
* Checkout from Version Control on WebStorm
* Github Clone from URL: https://github.com/CS410-2017Jan/Cards-Against-Humanity.git
* Open project in WebStorm
* Open Terminal window in WebStorm: View > Tool Windows > Terminal
* run the following commands in the WebStorm terminal
```
$ npm install
$ ionic platform add android
$ ionic build
$ ionic serve
```
* If "ionic serve" runs without a problem, you're good to go!
* Read this: https://ionicframework.com/docs/v2/resources/developer-tips/

**Running on Android Device:** (Super slow though??? --> use Nexus 5 (FHD < QHD))
* ```$ ionic build android```
* ```$ /Users/ScottHenry/Library/Android/sdk/tools/android sdk``` (In normal command line)
* Download Android 6.0 (API 23) & Tools & Extras
* Click Install Packages and accept the license agreement
* Run the Android Virtual Device manager (Some variation of below)
* ```$ /Users/ScottHenry/Library/Android/sdk/tools/android avd``` (In normal command line)
* Device Definitions > Nexus 6 > Create AVD…
* AVD Name: “test”
* Target: “Android 6.0”
* CPU/ABI: “Google APIs Intel Atom (x86)”
* Skin: “Skin with dynamic hardware controls”
* Select “test” > Start > Launch
* ```$ ionic build android ```
* ```$ cordova platform add android ```
* ```$ ionic emulate android -ls``` (Only once the emulator is up and running)

**Notes:**
* If your emulator is slow, change it to a Nexus 5.
* If the Intel hardware acceleration (HAXM) isn't working or maybe the emulator isn't running, try checking your BIOS to see if Intel Virtualization Technology is enabled.

**How to update node for testing:**
* Delete your "node_modules" folder
* Run these commands, if ionic builds runs without issue, you've updated your modules correctly!
```
$ ionic state reset
$ npm clear cache
$ ionic state restore
$ npm install
$ npm update
$ ionic build
```

**How to run tests:**
* To run the testing page (will open chrome window): ```$ npm test ```
* To generate code coverage (will generate coverage folder): ```$ npm run-script testcov ```
* To view coverage report, open the location of Cards-Against-Humanity/coverage/lcov-report/index.html on your computer in any browser.
* For example: /Users/ScottHenry/WebstormProjects/Cards-Against-Humanity/coverage/lcov-report/index.html

**How to write tests:**
* Start here: https://www.joshmorony.com/how-to-unit-test-an-ionic-2-application/
* Find a tutorial for your type of test here: https://www.joshmorony.com/tag/testing/
