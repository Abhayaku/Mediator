import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity, BackHandler, TextInput,
    ToastAndroid, Keyboard
} from 'react-native';
import { DotIndicator } from 'react-native-indicators';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Otpview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            verificationcode: '',
            confirmResult: '',
            activebutton: false,
            timer: 60,
            resend: false,
            match: false,
            userdata: []
        };
    }

    // mount----------------------------------------------------------------------------------------------------------------------------------------------
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backpress);
        this.interval = setInterval(
            () => this.setState((prevState) => ({ timer: prevState.timer - 1 })),
            1000
        );
        this.unsubscribe = auth().onAuthStateChanged(this.onAuthStateChanged);
    }

    // update----------------------------------------------------------------------------------------------------------------------------------------------
    componentDidUpdate() {
        if (this.state.timer == 0) {
            clearInterval(this.interval);
        }
    }

    // backpress----------------------------------------------------------------------------------------------------------------------------------------------------
    backpress = () => {
        this.props.navigation.navigate('Login');
        return true;
    }

    // authentication check change----------------------------------------------------------------------------------------------------------------------------------------------------
    onAuthStateChanged = (user) => {
        const number = this.props.route.params.number;
        if (user == null) {
            setTimeout(() => {
                this.handlesencode();
            }, 1000);
        }
        else {
            if (user.phoneNumber == `+91${number}`) {
                this.setState({ match: true });
            }
            setTimeout(() => {
                this.handlesencode();
            }, 1000);
        }
    };

    // send the code----------------------------------------------------------------------------------------------------------------------------------------------------
    handlesencode = () => {
        const number = `+91${this.props.route.params.number}`;
        auth().signInWithPhoneNumber(number)
            .then(confirmResult => {
                this.setState({ confirmResult });
            })
            .catch(error => {
                console.log(error)
            });
    }

    // code verification----------------------------------------------------------------------------------------------------------------------------------------------------
    VerifyCode = () => {
        if (this.state.verificationcode.length == 6) {
            if (this.state.match) {
                setTimeout(() => {
                    this.getuser();
                }, 1000);
            }
            else {
                this.state.confirmResult.confirm(this.state.verificationcode)
                    .then(() => {
                        setTimeout(() => {
                            this.getuser();
                        }, 1000);
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        }
        else {
            ToastAndroid.showWithGravity('Please enter a 6 digits OTP.', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
            this.setState({ activebutton: false });
        }
    }

    // get user details----------------------------------------------------------------------------------------------------------------------------------------------------
    getuser = () => {
        firestore().collection('Users').onSnapshot(querySnapshot => {
            const userdata = querySnapshot.docs.map(documentSnapshot => {
                return {
                    _id: documentSnapshot.id,
                    phonenumber: documentSnapshot.phonenumber,
                    name: documentSnapshot.name,
                    ...documentSnapshot.data()
                };
            });
            this.setState({ userdata: userdata });
        });
        setTimeout(() => {
            this.login();
        }, 1000);
    }

    // login of user----------------------------------------------------------------------------------------------------------------------------------------------------
    login = async () => {
        var pass = '';
        var name = '';
        var email = '';
        for (var i = 0; i < this.state.userdata.length; i++) {
            if (this.state.userdata[i].phonenumber == this.props.route.params.number) {
                pass = this.state.userdata[i].password;
                name = this.state.userdata[i].name;
                email = this.state.userdata[i].email;
            }
        }
        setTimeout(async () => {
            let userinfo = [
                ['logincode', 'user do not logout'],
                ['name', name],
                ['phonenumber', this.props.route.params.number],
                ['email', email],
                ['password', pass],
            ];
            await AsyncStorage.multiSet(userinfo);
            setTimeout(() => {
                ToastAndroid.showWithGravity(`Welcome to Mediator`, ToastAndroid.LONG, ToastAndroid.BOTTOM);
            }, 1000);
            setTimeout(() => {
                this.setState({ activebutton: false, verificationcode: '', confirmResult: '' });
                this.props.navigation.navigate('Homepage');
            }, 1000);
        }, 1000);
    }

    // unmount----------------------------------------------------------------------------------------------------------------------------------------------
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backpress);
        this.unsubscribe();
        clearInterval(this.interval);
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: backgroundcolor, alignItems: "center" }}>


                {/* header */}
                <View style={{ padding: widthsize * 5 / 100, justifyContent: 'center', alignItems: 'center' }}>
                    <Text allowFontScaling={false} style={{ color: highlightcolor, fontWeight: 'bold', fontSize: widthsize * 5 / 100 }}>
                        OTP Verification
                    </Text>
                </View>

                <View style={{ padding: widthsize * 5 / 100 }}>
                    <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 3 / 100, textAlign: 'center' }}>
                        Verify the unique code send to you.
                    </Text>
                </View>

                {/* Otp enter text input */}
                <View style={{ marginTop: heightsize * 3 / 100, alignItems: 'center', justifyContent: 'center' }}>
                    <TextInput
                        maxLength={6}
                        autoFocus={true}
                        keyboardType='number-pad'
                        placeholder='Enter 6 digits OTP'
                        placeholderTextColor={highlightcolor}
                        value={this.state.verificationcode}
                        onChangeText={(text) => this.setState({ verificationcode: text })}
                        style={{
                            width: widthsize * 85 / 100, backgroundColor: buttonbackground, padding: widthsize * 3 / 100, borderRadius: widthsize * 3 / 100,
                            color: textcolor,
                        }} />
                </View>

                {/* verify button */}
                {
                    this.state.activebutton == false
                        ?
                        <View style={{ marginTop: heightsize * 3 / 100, alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity delayPressIn={0} onPress={() => {
                                Keyboard.dismiss();
                                this.setState({ activebutton: true });
                                this.VerifyCode();
                            }}
                                activeOpacity={0.5}
                                style={{
                                    width: widthsize * 40 / 100, backgroundColor: statusbarcolor, alignItems: 'center', justifyContent: 'center',
                                    borderRadius: widthsize * 3 / 100, height: heightsize * 6 / 100
                                }}>
                                <Text style={{ color: textcolor, fontSize: widthsize * 3 / 100 }}> Verify </Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={{ marginTop: heightsize * 3 / 100, alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity disabled={true}
                                style={{
                                    width: widthsize * 40 / 100, backgroundColor: statusbarcolor, alignItems: 'center', justifyContent: 'center',
                                    borderRadius: widthsize * 3 / 100, height: heightsize * 6 / 100
                                }}>
                                <DotIndicator color={textcolor} size={widthsize * 1 / 100} />
                            </TouchableOpacity>
                        </View>
                }

                {/* timer */}
                <View style={{ marginTop: heightsize * 5 / 100, alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
                    <Text allowFontScaling={false} style={{ color: highlightcolor, fontSize: widthsize * 3 / 100, textAlign: 'center' }}>
                        Resend the one time password in
                    </Text>
                    {
                        this.state.timer == 0
                            ?
                            <TouchableOpacity delayPressIn={0} onPress={() => {
                                this.Resendcode();
                            }}
                                activeOpacity={0.5}
                                style={{
                                    width: widthsize * 15 / 100, backgroundColor: statusbarcolor, alignItems: 'center', justifyContent: 'center',
                                    borderRadius: widthsize * 2 / 100, height: heightsize * 3 / 100, marginLeft: 10
                                }}>
                                <Text style={{ color: textcolor, fontSize: widthsize * 2.5 / 100 }}> Send </Text>
                            </TouchableOpacity>
                            :
                            <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 3 / 100, textAlign: 'center', marginLeft: 10 }}>
                                {
                                    this.state.timer >= 10
                                        ?
                                        `00:${this.state.timer}`
                                        :
                                        `00:0${this.state.timer}`
                                }
                            </Text>
                    }
                </View>

            </View >
        );
    }
}
