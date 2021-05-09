import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

export default class Page1 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: backgroundcolor,
        }}>
        <TouchableOpacity
          style={{padding: 50, backgroundColor: 'white'}}
          onPress={() => this.props.navigation.navigate('Page2')}>
          <Text>GO</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
