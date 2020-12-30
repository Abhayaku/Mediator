import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity, TouchableHighlight, ToastAndroid,
    BackHandler, TouchableWithoutFeedback, Animated,
} from 'react-native';
import Image from 'react-native-image-progress';
import Logouticon from 'react-native-vector-icons/MaterialCommunityIcons';
import Helpicon from 'react-native-vector-icons/Entypo';
import Contacticon from 'react-native-vector-icons/Ionicons';
import Accounticon from 'react-native-vector-icons/MaterialCommunityIcons';
import UserIcon from 'react-native-vector-icons/FontAwesome';
import { PacmanIndicator, UIActivityIndicator } from 'react-native-indicators';
import Backicon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logout: false,
            logoutalert: false,
            Showindicator: true,
            fadevalue: new Animated.Value(0),
        };
    }

    // mount----------------------------------------------------------------------------------------------------------------------------------------------
    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backpress);
        const name = await AsyncStorage.getItem('name');
        const phonenumber = await AsyncStorage.getItem('phonenumber');
        const imageurl = await AsyncStorage.getItem('profilepicture');
        this.setState({ name, phonenumber, imageurl });
        setTimeout(() => {
            this.setState({ Showindicator: false })
        }, 1000);
    }

    // back press-----------------------------------------------------------------------
    backpress = () => {
        this.props.navigation.goBack();
        return true;
    }

    // animation----------------------------------------------------------------------------------------------------------------------------------------------
    fadeanimation = () => {
        Animated.timing(this.state.fadevalue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true
        }).start()
    }

    // user logout----------------------------------------------------------------------------------------------------------------------------------------------
    logout = () => {
        this.setState({ logout: true, logoutalert: false });
        setTimeout(async () => {
            let userdata = [
                'logincode', 'name', 'phonenumber', 'email', 'password', 'profilepicture'
            ];
            await AsyncStorage.multiRemove(userdata).then(() => {
                setTimeout(() => {
                    this.setState({ logout: false });
                    this.props.navigation.navigate("Login");
                }, 1000);
            })
        }, 2000);
    }

    workinprogress = () => {
        ToastAndroid.showWithGravity('Work in Progress.', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    }

    // unmount----------------------------------------------------------------------------------------------------------------------------------------------
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backpress);
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: backgroundcolor }} >

                {/* header */}
                < View style={{
                    backgroundColor: topheader, height: heightsize * 9 / 100, alignItems: 'center',
                    flexDirection: 'row',
                }}>
                    <TouchableHighlight onPress={() => this.props.navigation.goBack()} activeOpacity={0.9} delayPressIn={0}
                        underlayColor={buttonbackground}
                        style={{ marginLeft: widthsize * 2 / 100, padding: widthsize * 4 / 100, borderRadius: widthsize * 10 / 100 }}>
                        <Backicon name='arrowleft'
                            size={widthsize * 5 / 100}
                            color={highlightcolor} />
                    </TouchableHighlight>
                    <View style={{ marginLeft: widthsize * 2 / 100, }}>
                        <Text allowFontScaling={false} style={{ color: highlightcolor, fontSize: widthsize * 3.5 / 100, letterSpacing: 2 }}>
                            Settings
                        </Text>
                    </View>
                </View >

                {
                    this.state.Showindicator == true
                        ?
                        <View style={{ flex: 1, backgroundColor: backgroundcolor, alignItems: "center", justifyContent: 'center' }}>
                            <UIActivityIndicator color={highlightcolor} size={widthsize * 5 / 100} count={12} />
                        </View>
                        :
                        <View style={{ flex: 1, backgroundColor: backgroundcolor }}>
                            <View style={{ padding: widthsize * 4 / 100, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderColor: highlightcolor, }}>
                                {
                                    this.state.imageurl == 'No Photo'
                                        ?
                                        <View style={{
                                            width: widthsize * 16 / 100, height: widthsize * 16 / 100, borderColor: highlightcolor, justifyContent: 'center',
                                            borderRadius: (widthsize * 16 / 100) / 2, overflow: 'hidden', borderWidth: 1, alignItems: 'center'
                                        }}>
                                            <UserIcon name='user'
                                                size={widthsize * 7 / 100}
                                                color={highlightcolor} />
                                        </View>
                                        :
                                        <TouchableOpacity activeOpacity={0.6} delayPressIn={0} onPress={() => this.props.navigation.navigate("Profileview")}>
                                            <Image
                                                source={{ uri: this.state.imageurl }}
                                                indicator={UIActivityIndicator}
                                                indicatorProps={{
                                                    size: widthsize * 3 / 100,
                                                    color: highlightcolor,
                                                }}
                                                style={{
                                                    width: widthsize * 16 / 100, height: widthsize * 16 / 100, borderColor: highlightcolor,
                                                    borderRadius: (widthsize * 16 / 100) / 2, overflow: 'hidden', borderWidth: 1
                                                }} />
                                        </TouchableOpacity>
                                }
                                <View style={{ flex: 1, marginLeft: widthsize * 3 / 100 }}>
                                    <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 3 / 100, letterSpacing: 1 }}>
                                        {this.state.name}
                                    </Text>
                                    <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 2.5 / 100, opacity: 0.5, marginTop: 5, letterSpacing: 1 }}>
                                        {this.state.phonenumber}
                                    </Text>
                                </View>
                            </View>

                            {/* account */}
                            <TouchableHighlight onPress={() => { this.workinprogress(); }}
                                activeOpacity={0.8} delayPressIn={0} underlayColor={buttonbackground}
                                style={{ padding: widthsize * 3 / 100 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <View style={{
                                        width: widthsize * 10 / 100, height: widthsize * 10 / 100, justifyContent: 'center',
                                        overflow: 'hidden', alignItems: 'center'
                                    }}>
                                        <Accounticon name='account-key'
                                            size={widthsize * 5 / 100}
                                            color={highlightcolor} />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: widthsize * 3 / 100 }}>
                                        <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 3 / 100, letterSpacing: 1 }}>
                                            Account
                                    </Text>
                                    </View>
                                </View>
                            </TouchableHighlight>

                            {/* help */}
                            <TouchableHighlight onPress={() => { this.workinprogress(); }}
                                activeOpacity={0.8} delayPressIn={0} underlayColor={buttonbackground}
                                style={{ padding: widthsize * 3 / 100 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <View style={{
                                        width: widthsize * 10 / 100, height: widthsize * 10 / 100, justifyContent: 'center',
                                        overflow: 'hidden', alignItems: 'center'
                                    }}>
                                        <Helpicon name='help'
                                            size={widthsize * 5 / 100}
                                            color={highlightcolor} />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: widthsize * 3 / 100 }}>
                                        <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 3 / 100, letterSpacing: 1 }}>
                                            Help
                                    </Text>
                                    </View>
                                </View>
                            </TouchableHighlight>

                            {/* contact */}
                            <TouchableHighlight onPress={() => { this.workinprogress(); }}
                                activeOpacity={0.8} delayPressIn={0} underlayColor={buttonbackground}
                                style={{ padding: widthsize * 3 / 100 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <View style={{
                                        width: widthsize * 10 / 100, height: widthsize * 10 / 100, justifyContent: 'center',
                                        overflow: 'hidden', alignItems: 'center'
                                    }}>
                                        <Contacticon name='call'
                                            size={widthsize * 5 / 100}
                                            color={highlightcolor} />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: widthsize * 3 / 100 }}>
                                        <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 3 / 100, letterSpacing: 1 }}>
                                            Contact Us
                                    </Text>
                                    </View>
                                </View>
                            </TouchableHighlight>

                            {/* Log out */}
                            <TouchableHighlight onPress={() => {
                                this.setState({ logoutalert: true });
                                this.fadeanimation();
                            }}
                                activeOpacity={0.8} delayPressIn={0} underlayColor={buttonbackground}
                                style={{ padding: widthsize * 3 / 100 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <View style={{
                                        width: widthsize * 10 / 100, height: widthsize * 10 / 100, justifyContent: 'center',
                                        overflow: 'hidden', alignItems: 'center'
                                    }}>
                                        <Logouticon name='logout'
                                            size={widthsize * 5 / 100}
                                            color={highlightcolor} />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: widthsize * 3 / 100 }}>
                                        <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 3 / 100, letterSpacing: 1 }}>
                                            Log Out
                                    </Text>
                                    </View>
                                </View>
                            </TouchableHighlight>

                            <View style={{
                                height: heightsize * 5 / 100, borderTopWidth: 0.5,
                                borderTopColor: highlightcolor, margin: widthsize * 5 / 100
                            }} />

                            <View style={{ alignItems: "center", justifyContent: 'center' }}>
                                <Text allowFontScaling={false} style={{ color: highlightcolor, fontSize: widthsize * 4 / 100, letterSpacing: 2 }}>
                                    Mediator
                                    </Text>
                                <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 2 / 100, marginTop: heightsize * 1 / 100, letterSpacing: 2 }}>
                                    Bringing Close The Peoples
                                    </Text>
                            </View>
                        </View>
                }
                {
                    this.state.logout == true ?
                        <View style={{ flex: 1, justifyContent: 'center', width: '100%', backgroundColor: 'rgba(0,0,0,0.9)', height: '100%', position: 'absolute' }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <PacmanIndicator color={highlightcolor} size={widthsize * 10 / 100} count={10} />
                            </View>
                        </View>
                        :
                        <View />
                }
                {
                    this.state.logoutalert == true ?
                        <TouchableWithoutFeedback onPress={() => this.setState({ logoutalert: false })}>

                            <View style={{ flex: 1, justifyContent: 'center', width: widthsize, backgroundColor: 'rgba(0,0,0,0.9)', height: heightsize, position: 'absolute', padding: widthsize * 3 / 100 }}>
                                <TouchableWithoutFeedback onPress={() => this.setState({ logoutalert: true })}>

                                    <Animated.View style={{ height: '20%', backgroundColor: buttonbackground, padding: widthsize * 5 / 100, opacity: this.state.fadevalue }}>

                                        <View style={{ height: '20%' }}>
                                            <Text allowFontScaling={false} style={{ color: highlightcolor, fontWeight: 'bold', fontSize: widthsize * 3 / 100, letterSpacing: 1 }}>
                                                Log Out
                                            </Text>
                                        </View>

                                        <View style={{ height: '20%' }} />

                                        <View style={{ height: '20%', flexDirection: 'row', alignItems: 'center' }}>
                                            <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 2.5 / 100, letterSpacing: 1 }}>
                                                Do you want to log out from the application
                                            </Text>
                                            <Text allowFontScaling={false} style={{ color: highlightcolor, fontSize: widthsize * 2.5 / 100, letterSpacing: 1 }}>
                                                {"  "}{this.state.name}
                                            </Text>
                                            <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 2.5 / 100, letterSpacing: 1 }}>
                                                ?
                                            </Text>
                                        </View>

                                        <View style={{ height: '20%' }} />

                                        <View style={{ height: '20%', alignItems: 'center', flexDirection: 'row-reverse' }}>
                                            <View>
                                                <TouchableOpacity onPress={() => this.logout()}>
                                                    <Text allowFontScaling={false} style={{ color: highlightcolor, fontSize: widthsize * 3 / 100, fontWeight: 'bold', marginRight: widthsize * 4 / 100, letterSpacing: 1 }}>
                                                        Yes
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                            < View >
                                                <TouchableOpacity onPress={() => this.setState({ logoutalert: false })}>
                                                    <Text allowFontScaling={false} style={{ color: highlightcolor, fontSize: widthsize * 3 / 100, fontWeight: 'bold', marginRight: widthsize * 8 / 100, letterSpacing: 1 }}>
                                                        No
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                    </Animated.View>
                                </TouchableWithoutFeedback>

                            </View>
                        </TouchableWithoutFeedback>
                        :
                        <View />
                }
            </View >
        );
    }
}
