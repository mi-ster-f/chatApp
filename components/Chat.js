import React from 'react';
import { View, Text } from 'react-native';

// The application’s main Chat component that renders the chat UI
export default class Chat extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    let chosenColor = this.props.route.params.color;

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: chosenColor,
        }}
      >
        <Text>Hello Screen2!</Text>
      </View>
    );
  }
}
