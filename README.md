# The Chat App!

The Chat app is a React-Native Chat app leveraging the Gifted Chat library. 

Featuring:

* offline-storage 
*  cloud-based file and message storing in Firebase 
* view your messages offline
* ability to send your location or a photo off your mobile.
 
### Installation Guide

* Clone the repo `git clone https://github.com/fratzio/chatApp.git`
* Make sure you are at the root directory when installing dependencies `chatApp` 
* The Chat app requires the Expo command line interface to run `npm install expo-cli --global`
* Then install the dependencies `npm i`
* Sometimes Firebase has been known to throw install errors. In this case, install it directly `Install firebase --save`
* To start the app `npm/expo start`
* Install the [Expo mobile app for Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_CA) 
* Open the Expo app on mobile and select "Scan QR code"
* Scan the QR code that is generated from running `npm/expo start`

### Dependencies
```
    "@react-native-community/async-storage": "^1.11.0",
    "@react-native-community/masked-view": "0.1.10",
    "@react-native-community/netinfo": "^5.9.6",
    "@react-navigation/native": "^5.7.2",
    "@react-navigation/stack": "^5.8.0",
    "cookies": "^0.8.0",
    "expo": "~38.0.8",
    "expo-image-picker": "~8.3.0",
    "expo-location": "~8.2.1",
    "expo-permissions": "~9.0.1",
    "expo-status-bar": "^1.0.2",
    "firebase": "^7.9.0",
    "react": "~16.11.0",
    "react-dom": "~16.11.0",
    "react-native": "https://github.com/expo/react-native/archive/sdk-38.0.2.tar.gz",
    "react-native-gesture-handler": "~1.6.0",
    "react-native-gifted-chat": "^0.16.3",
    "react-native-keyboard-spacer": "^0.4.1",
    "react-native-maps": "0.27.1",
    "react-native-reanimated": "~1.9.0",
    "react-native-safe-area-context": "~3.0.7",
    "react-native-screens": "~2.9.0",
    "react-native-web": "~0.11.7",
    "react-navigation": "^4.4.0"
```

### Features and snaps
>  Login screen
* Once you load the app...
* Type in your username
* Select a background colour scheme
* Start chatting!

[![Screenshot-20200903-001443.png](https://i.postimg.cc/7h1YRkRG/Screenshot-20200903-001443.png)](https://postimg.cc/GT2CBZdd)



> Chat view
* Click the plus icon to bring up an actions view...
* Send a photo from your camera roll to the chat
* Take a photo with your camera in real-time and send to chat
* Send your location to chat

[![Screenshot-20200903-001631.png](https://i.postimg.cc/kMW4GQ5J/Screenshot-20200903-001631.png)](https://postimg.cc/F1smnJc8)




