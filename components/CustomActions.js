import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// APIs for native mobile functionality
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

// import firebase
const firebase = require('firebase');
require('firebase/firestore');

export default class CustomActions extends React.Component {
  constructor() {
    super();
  }

  // function uses permissions API and ImagePicker API to get local image file and sends it as a prop for CustomActions
  pickImage = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status === 'granted') {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'Images',
        }).catch((error) => console.log(error));
        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  // function uses permissions API and imagepicker API to take a photo with user's camera
  takePhoto = async () => {
    try {
      const { status } = await Permissions.askAsync(
        Permissions.CAMERA_ROLL && Permissions.CAMERA
      );
      if (status === 'granted') {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: 'Images',
        }).catch((error) => console.log(error));
        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  // function uses permissions API and Location API to get user's location
  getLocation = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        let result = await Location.getCurrentPositionAsync({}).catch((error) =>
          console.log(error)
        );
        if (result) {
          // don't need to store this in Firebase since the MapView component simply renders a map view if it sees
          // coordinates in the message payload
          this.props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            },
          });
        }
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  // uploading image to the cloud
  uploadImage = async (uri) => {
    try {
      // Before you upload an image to Firebase storage with Expo, you need to convert the file into a blob
      // fetch doesn’t seem to work in combination with blobs.
      // so we will create a new XMLHttpRequest and set its responseType to 'blob'.
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
      // Use split to break down the uri path into sections we can reference with indices
      let uriParts = uri.split('/');
      // the image name is the last indexed item
      let imageName = uriParts[uriParts.length - 1];
      // creates a reference to the file in Firebase
      const ref = firebase.storage().ref().child(`${imageName}`);
      //  put is asynchronous and returns a promise
      const snapshot = await ref.put(blob);
      // close the XMLHttpRequest connection request
      blob.close();
      // use firebases getDownloadURL method to extract the image URL from the server
      const imageUrl = await snapshot.ref.getDownloadURL();

      return imageUrl;
    } catch (error) {
      console.log(error);
    }
  };

  //
  onActionPress = () => {
    const options = [
      'Choose From Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            this.pickImage();
            return;
          case 1:
            console.log('user wants to take a photo');
            this.takePhoto();
            return;
          case 2:
            console.log('user wants to get their location');
            this.getLocation();
          default:
        }
      }
    );
  };

  render() {
    return (
      <TouchableOpacity
        style={[styles.container]}
        accessible={true}
        accessibilityLabel="More options"
        accessibilityHint="Lets you choose to send an image or your geolocation."
        accessibilityRole="button"
        onPress={this.onActionPress}
      >
        <View style={[styles.wrapper]}>
          <Text style={[styles.iconText]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

/*
Styling 
*/

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};
