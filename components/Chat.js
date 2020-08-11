import React from 'react';
import { View, Text, Platform } from 'react-native';
import { GiftedChat, Bubble, SystemMessage } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';

// import firebase
const firebase = require('firebase');
require('firebase/firestore');

// Credentials for connecting App to Firebase db
const firebaseConfig = {
  apiKey: 'AIzaSyAEhunEEpBQ4AnUWRsiBwcW9OAYdqbmEsw',
  authDomain: 'thechatapp-70e0b.firebaseapp.com',
  databaseURL: 'https://thechatapp-70e0b.firebaseio.com',
  projectId: 'thechatapp-70e0b',
  storageBucket: 'thechatapp-70e0b.appspot.com',
  messagingSenderId: '84608277230',
  appId: '1:84608277230:web:54339df014037cf83cb1ff',
  measurementId: 'G-GX4ETXWZ8H',
};

// The application’s main Chat component that renders the chat UI
class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: [], uid: '' };

    // create a constructor that will initialize the Firestore app and add the config inside it
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    this.referenceMessageUser = null;
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text.toString(),
        createdAt: data.createdAt.toDate(),
        user: data.user,
        avatar: data.avatar,
        uid: data.uid,
      });
    });
    this.setState({
      messages,
    });
  };

  // Add/save a message to Firestore
  addMessage() {
    let message = this.state.messages;
    console.log(message[0]);
    this.referenceMessages.add({
      _id: message[0]._id,
      text: message[0].text,
      createdAt: message[0].createdAt,
      user: this.props.route.params.name,
      uid: this.state.uid,
      avatar: 'https://placeimg.com/140/140/any',
    });
  }

  // Function to append new message to the state "messages" in the component
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    this.addMessage();
  }

  // function prop for GiftedChat to customise the chat bubble
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000',
          },
        }}
      />
    );
  }

  // function prop for styling of system message in messages state
  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        // containerStyle={{ backgroundColor: 'pink' }}
        // wrapperStyle={{ borderWidth: 10, borderColor: 'white' }}
        textStyle={{ color: '#fff', fontWeight: '900' }}
      />
    );
  }

  // Mount component with initial state including welcome message from system and user
  componentDidMount() {
    // creating a references to messages collection in Firestore db
    this.referenceMessages = firebase.firestore().collection('messages');

    //Authorise users anonymously and listen for auth change events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        try {
          await firebase.auth().signInAnonymously();
        } catch (err) {
          console.log(err);
        }
      }

      //update user state with currently active user data
      this.setState({
        uid: user.uid,
        messages: [
          {
            _id: 1,
            text: 'Hello developer',
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'React Native',
              avatar: 'https://placeimg.com/140/140/any',
            },
          },
          {
            _id: 3,
            text: 'Welcome to the chat, ' + this.props.route.params.name,
            createdAt: new Date(),
            system: true,
          },
        ],
        loggedInText: 'Please wait, you are getting logged in',
      });
      if (this.referenceMessages == null || undefined) {
        console.log('error');
      } else {
        // create a reference to the active user's messages
        this.referenceMessageUser = firebase
          .firestore()
          .collection('messages')
          .where('uid', '==', this.state.uid);

        /*
        The onSnapshot method returns an unsubscribe function so all we need to do is save that reference
       and call the function when the component is unmounted.
       */
        console.log('this user uid is ' + this.state.uid);
        // listen for collection changes for current user
        this.unsubscribeMessagesUser = this.referenceMessagesUser.onSnapshot(
          this.onCollectionUpdate
        );
      }
    });
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // // stop listening for changes
    this.unsubscribeMessagesUser();
  }

  render() {
    // Decouple props
    let { name } = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    let { chosenColor } = this.props.route.params.color;

    return (
      // Make sure to set View container to flex 1 so it covers full screen
      <View style={{ flex: 1 }}>
        <GiftedChat
          // Gifted Chat component
          messagesContainerStyle={{
            backgroundColor: this.props.route.params.color,
          }}
          renderBubble={this.renderBubble}
          renderSystemMessage={this.renderSystemMessage}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />

        {
          // Library is used to avoid Android keyboard from covering input /
          // if no Android this isn't used
          // Platform.OS === 'android' ? <KeyboardSpacer /> : null
        }
      </View>
    );
  }
}

export default Chat;
