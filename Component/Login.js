import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity, BackHandler, TextInput,
    Keyboard, ToastAndroid
} from 'react-native';
import { DotIndicator } from 'react-native-indicators';
import Icon from 'react-native-vector-icons/Entypo';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phonenumber: '',
            password: '',
            loginwithpass: false,
            loginwithotp: false,
            signupactivebutton: false,
            iconname: "eye-with-line",
            hidden: true,
            userdata: [],
            // height: 0
        };
    }
    
    // mount----------------------------------------------------------------------------------------------------------------------------------------------
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backpress);
/*         this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
 */    }

    //  backpress----------------------------------------------------------------------------------------------------------------------------------------------------
    backpress = () => {
        BackHandler.exitApp();
        return true;
    }

    /*     keyboardDidShow = (e) => {
            var keyboardheight = e.endCoordinates.height;
            this.setState({ height: keyboardheight + 50 })
        };
        keyboardDidHide = () => {
            this.setState({ height: 0 })
        }; */

    // pass eye icon press----------------------------------------------------------------------------------------------------------------------------------------------------
    iconpress = () => {
        let iconname = (this.state.hidden) ? "eye" : "eye-with-line";
        this.setState({
            hidden: !this.state.hidden,
            iconname: iconname
        });
    }

    // otp login----------------------------------------------------------------------------------------------------------------------------------------------------
    CheckPhoneNumberotp = () => {
        if (this.state.phonenumber == '') {
            ToastAndroid.showWithGravity('Phone number can not be empty. Try again !', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
            this.setState({ loginwithpass: false });
        }
        else {
            const check = /^[0]?[789]\d{9}$/;
            if (check.test(this.state.phonenumber) == false) {
                ToastAndroid.showWithGravity('Phone number is invalid. Try again !', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                this.setState({ loginwithotp: false });
            }
            else {
                setTimeout(() => {
                    this.getuser("OTP");
                }, 1000);
            }
        }
    }

    // pass login----------------------------------------------------------------------------------------------------------------------------------------------------
    CheckPhoneNumberpass = () => {
        if (this.state.phonenumber == '' || this.state.password == '') {
            ToastAndroid.showWithGravity('Phone number or password can not be empty. Try again !', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
            this.setState({ loginwithpass: false });
        }
        else {
            const check = /^[0]?[789]\d{9}$/;
            if (check.test(this.state.phonenumber) == false) {
                ToastAndroid.showWithGravity('Phone number is invalid. Try again !', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                this.setState({ loginwithpass: false });
            }
            else {
                setTimeout(() => {
                    this.getuser("PASS");
                }, 1000);
            }
        }
    }

    // get user details----------------------------------------------------------------------------------------------------------------------------------------------------
    getuser = (name) => {
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
            if (name == "OTP") {
                this.checkuserexistance();
            }
            else {
                this.login();
            }
        }, 1000);
    }

    // check user existance----------------------------------------------------------------------------------------------------------------------------------------------------
    checkuserexistance = () => {
        var match = true;
        if (this.state.userdata.length == 0) {
            match = false;
        }
        else {
            for (var i = 0; i < this.state.userdata.length; i++) {
                if (this.state.userdata[i].phonenumber != this.state.phonenumber) {
                    match = true;
                }
            }
        }
        if (match == true) {
            setTimeout(() => {
                const number = this.state.phonenumber
                this.setState({ loginwithotp: false, phonenumber: '', password: '' });
                this.props.navigation.navigate('Otpview', { number: number });
            }, 1000);
        }
        else {
            setTimeout(() => {
                ToastAndroid.showWithGravity('Phone number is not registered, kindly create an account', ToastAndroid.LONG, ToastAndroid.BOTTOM);
                this.setState({
                    phonenumber: '',
                    password: '',
                    loginwithotp: false,
                });
            }, 1000);
        }
    }

    // login of user with pass----------------------------------------------------------------------------------------------------------------------------------------------------
    login = async () => {
        var phonematch = false;
        var passmatch = false;
        var name = '';
        var email = '';
        var profilepicture = '';
        if (this.state.userdata.length == 0) {
            phonematch = false;
        }
        else {
            for (var i = 0; i < this.state.userdata.length; i++) {
                if (this.state.userdata[i].phonenumber == this.state.phonenumber) {
                    if (this.state.userdata[i].password == this.state.password) {
                        phonematch = true;
                        passmatch = true;
                        name = this.state.userdata[i].name;
                        email = this.state.userdata[i].email;
                        profilepicture = this.state.userdata[i].imageurl;
                    }
                }
            }
        }
        if (phonematch == true && passmatch == true) {
            let userinfo = [
                ['logincode', 'user do not logout'],
                ['name', name],
                ['phonenumber', this.state.phonenumber],
                ['email', email],
                ['password', this.state.password],
                ['profilepicture', profilepicture],
            ];
            await AsyncStorage.multiSet(userinfo);
            setTimeout(() => {
                ToastAndroid.showWithGravity(`Welcome to Mediator`, ToastAndroid.LONG, ToastAndroid.BOTTOM);
            }, 1000);
            setTimeout(() => {
                this.setState({
                    phonenumber: '',
                    password: '',
                    loginwithpass: false,
                });
                this.props.navigation.navigate('Homepage');
            }, 1000);
        }
        else {
            if (phonematch == false) {
                setTimeout(() => {
                    ToastAndroid.showWithGravity('Phone number is not registered, kindly create an account', ToastAndroid.LONG, ToastAndroid.BOTTOM);
                    this.setState({
                        phonenumber: '',
                        password: '',
                        loginwithpass: false,
                    });
                }, 1000);
            }
            else {
                setTimeout(() => {
                    ToastAndroid.showWithGravity('Password is invalid, kindly try again', ToastAndroid.LONG, ToastAndroid.BOTTOM);
                    this.setState({
                        password: '',
                        loginwithpass: false,
                    });
                }, 1000);
            }
        }
    }

    // unmount----------------------------------------------------------------------------------------------------------------------------------------------
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backpress);
/*         this.keyboardDidHideListener.remove();
        this.keyboardDidShowListener.remove();
 */    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: backgroundcolor, alignItems: "center", backgroundColor: backgroundcolor }}>

                {/* header */}
                <View style={{ padding: widthsize * 5 / 100, justifyContent: 'center', alignItems: 'center' }}>
                    <Text allowFontScaling={false} style={{ color: highlightcolor, fontWeight: 'bold', fontSize: widthsize * 5 / 100 }}>
                        Login to Mediator
                    </Text>
                </View>

                <View style={{ padding: widthsize * 3 / 100 }}>
                    <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 3 / 100, textAlign: 'center' }}>
                        Enter your phone number and password to verify your identity
                    </Text>
                </View>

                {/* phone number */}
                <View style={{ marginTop: heightsize * 3 / 100, alignItems: 'center', flexDirection: 'row' }}>
                    <TextInput
                        placeholder='+91'
                        editable={false}
                        placeholderTextColor={highlightcolor}
                        style={{
                            width: widthsize * 12 / 100, height: heightsize * 7 / 100, backgroundColor: buttonbackground, borderRadius: widthsize * 3 / 100,
                            textAlign: 'center'
                        }} />
                    <TextInput
                        maxLength={10}
                        keyboardType='number-pad'
                        placeholder='Phone Number'
                        placeholderTextColor={highlightcolor}
                        value={this.state.phonenumber}
                        onChangeText={(text) => this.setState({ phonenumber: text.replace(/\s/g, '') })}
                        style={{
                            width: widthsize * 75 / 100, height: heightsize * 7 / 100, backgroundColor: buttonbackground, borderRadius: widthsize * 3 / 100,
                            color: textcolor, marginLeft: widthsize * 3 / 100, paddingLeft: widthsize * 3 / 100
                        }} />
                </View>

                {/* password */}
                <View style={{ marginTop: heightsize * 3 / 100, alignItems: 'center', flexDirection: 'row' }}>
                    <TextInput
                        placeholder='Password'
                        secureTextEntry={this.state.hidden}
                        placeholderTextColor={highlightcolor}
                        value={this.state.password}
                        onChangeText={(text) => this.setState({ password: text.replace(/\s/g, '') })}
                        style={{
                            width: widthsize * 75 / 100, height: heightsize * 7 / 100, backgroundColor: buttonbackground, borderRadius: widthsize * 3 / 100,
                            color: textcolor, borderTopRightRadius: 0, borderBottomRightRadius: 0, paddingLeft: widthsize * 3 / 100
                        }} />
                    <TouchableOpacity delayPressIn={0}
                        onPress={() => this.iconpress()}
                        style={{
                            width: widthsize * 15 / 100, height: heightsize * 7 / 100, backgroundColor: buttonbackground, borderRadius: widthsize * 3 / 100,
                            borderBottomLeftRadius: 0, borderTopLeftRadius: 0, alignItems: 'center', justifyContent: 'center'
                        }} >
                        <Icon name={this.state.iconname}
                            size={widthsize * 4 / 100}
                            color={highlightcolor}
                        />
                    </TouchableOpacity>
                </View>

                {/* login button */}
                {
                    this.state.loginwithpass == false
                        ?
                        <View style={{ marginTop: heightsize * 3 / 100, alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity delayPressIn={0} onPress={() => {
                                Keyboard.dismiss();
                                this.setState({ loginwithpass: true });
                                this.CheckPhoneNumberpass();
                            }}
                                activeOpacity={0.5}
                                style={{
                                    width: widthsize * 40 / 100, backgroundColor: statusbarcolor, alignItems: 'center', justifyContent: 'center',
                                    borderRadius: widthsize * 3 / 100, height: heightsize * 6 / 100
                                }}>
                                <Text style={{ color: textcolor, fontSize: widthsize * 3 / 100 }}> Login </Text>
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
                <View style={{ marginTop: heightsize * 3 / 100, width: widthsize, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    {/* login with otp */}
                    {
                        this.state.loginwithotp == false
                            ?
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <TouchableOpacity delayPressIn={0} onPress={() => {
                                    Keyboard.dismiss();
                                    this.setState({ loginwithotp: true });
                                    this.CheckPhoneNumberotp();
                                }}
                                    activeOpacity={0.5}
                                    style={{
                                        width: widthsize * 40 / 100, backgroundColor: statusbarcolor, alignItems: 'center', justifyContent: 'center',
                                        borderRadius: widthsize * 3 / 100, height: heightsize * 6 / 100
                                    }}>
                                    <Text style={{ color: textcolor, fontSize: widthsize * 3 / 100 }}> Login with OTP </Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <TouchableOpacity disabled={true}
                                    style={{
                                        width: widthsize * 40 / 100, backgroundColor: statusbarcolor, alignItems: 'center', justifyContent: 'center',
                                        borderRadius: widthsize * 3 / 100, height: heightsize * 6 / 100
                                    }}>
                                    <DotIndicator color={textcolor} size={widthsize * 1 / 100} />
                                </TouchableOpacity>
                            </View>
                    }
                    {/* sign up button */}
                    {
                        this.state.signupactivebutton == false
                            ?
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <TouchableOpacity delayPressIn={0} onPress={() => {
                                    Keyboard.dismiss();
                                    this.setState({ signupactivebutton: true });
                                    setTimeout(() => {
                                        this.props.navigation.navigate('Signup');
                                        this.setState({ signupactivebutton: false });
                                    }, 1500);
                                }}
                                    activeOpacity={0.5}
                                    style={{
                                        width: widthsize * 40 / 100, backgroundColor: statusbarcolor, alignItems: 'center', justifyContent: 'center',
                                        borderRadius: widthsize * 3 / 100, height: heightsize * 6 / 100
                                    }}>
                                    <Text style={{ color: textcolor, fontSize: widthsize * 3 / 100 }}>Create an account</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <TouchableOpacity disabled={true}
                                    style={{
                                        width: widthsize * 40 / 100, backgroundColor: statusbarcolor, alignItems: 'center', justifyContent: 'center',
                                        borderRadius: widthsize * 3 / 100, height: heightsize * 6 / 100
                                    }}>
                                    <DotIndicator color={textcolor} size={widthsize * 1 / 100} />
                                </TouchableOpacity>
                            </View>
                    }
                </View>
                {/* <View style={{ height: this.state.height }} /> */}

            </View >
        );
    }
}
