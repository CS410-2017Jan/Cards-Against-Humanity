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

**Running on Android Device:** (Super slow though???)
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
* ```$ ionic emulate android -ls``` (Only once the emulator is up and running)

