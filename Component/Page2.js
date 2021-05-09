import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

export default class Page2 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async send() {
    const FIREBASE_API_KEY =
      'AAAADmrAjiQ:APA91bGU-2-PpJHj2p301Gs5DbFa3CFfz2g8JS093Mn9XALnfy8DrGg78fPR6t0_-pEVGaXCf2aDAf6Vh-9Ytk4WEk3oulYb742LCemPYv_yWJ2BzaSoyNaYQpQPQRAFgnB5g8q1HvgN';
    const message = {
      registration_ids: [
        'eZ9z8-zeSi6zzIsPDLwxfu:APA91bHDwSkPR5k9tfP_2SK5kRue0aYnorEOkqsz8hTq1ZUWEL3rFGB719hp_qLYP9nObKp_t4Q9mhuItj-GdGeNzS0SqMtlMuj_lDly6AeBnb7Jp57-wt2hhts4m-gfjcWtGmKrlAEw',
      ],
      notification: {
        title: 'New Message',
        body: 'This is the body of the message',
        foreground: false,
        color: highlightcolor,
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        priority: 'high',
        content_available: true,
        userInteraction: true,
      },
    };

    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'key=' + FIREBASE_API_KEY,
      },
      body: JSON.stringify(message),
    });
    response = await response.json();
    console.log(response);
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
          onPress={() => this.props.navigation.navigate('Page1')}>
          <Text>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{padding: 50, marginTop: 10, backgroundColor: 'white'}}
          onPress={() => this.send()}>
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
