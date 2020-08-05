import React from 'react';
import { View, Text, Platform } from 'react-native';
import { GiftedChat, Bubble, SystemMessage } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';

// The application’s main Chat component that renders the chat UI
export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] };
  }

  componentDidMount() {
    this.setState({
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
          text: 'This is a system message',
          createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
          system: true,
        },
      ],
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
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

  // Send a system message to chat initially
  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        containerStyle={{ backgroundColor: 'pink' }}
        wrapperStyle={{ borderWidth: 10, borderColor: 'white' }}
        textStyle={{ color: 'crimson', fontWeight: '900' }}
      />
    );
  }

  render() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    let chosenColor = this.props.route.params.color;

    return (
      <View style={{ flex: 1 }}>
        <GiftedChat
          renderBubble={this.renderBubble}
          renderSystemMessage={this.renderSystemMessage}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
      </View>
    );
  }
}
