import React, { Component } from 'react';
import { View, Text, StatusBar } from 'react-native';
import MediatoreIcon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Splashscreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.getuser();
        }, 1000)
    }
    getuser = async () => {
        const logincode = await AsyncStorage.getItem("logincode");
        if (logincode == "user do not logout") {
            this.props.navigation.navigate('Homepage');
        }
        else {
            this.props.navigation.navigate('Login');
        }
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: backgroundcolor }}>
                <StatusBar backgroundColor={statusbarcolor} barStyle='light-content' />
                <View>
                    <MediatoreIcon name='chatbubbles'
                        size={widthsize * 40 / 100}
                        color={highlightcolor}>
                    </MediatoreIcon>
                </View>

                <View style={{ marginTop: heightsize * 3 / 100, opacity: this.state.fadevalue }}>
                    <Text allowFontScaling={false} style={{ color: highlightcolor, fontSize: widthsize * 8 / 100 }}>
                        Mediator
                    </Text>
                </View>

            </View>
        );
    }
}
