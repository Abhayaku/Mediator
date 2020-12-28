import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity, BackHandler, TextInput, Animated,
    Keyboard, ToastAndroid, TouchableHighlight, ScrollView, TouchableWithoutFeedback
} from 'react-native';
import Image from 'react-native-image-progress';
import { DotIndicator, UIActivityIndicator } from 'react-native-indicators';
import Icon from 'react-native-vector-icons/Entypo';
import Backicon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import Usericon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phonenumber: '',
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            confirmpass: '',
            signupactivebutton: false,
            passiconname: "eye-with-line",
            cnficonname: "eye-with-line",
            passhidden: true,
            cnfhidden: true,
            userdata: [],
            profileimage: '',
            imageurl: 'No Photo',
            imagechoose: false,
            fadevalue: new Animated.Value(0),
            uploadimage: false,
            // height: 0,
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
        this.props.navigation.goBack();
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
    passpress = () => {
        let iconname = (this.state.passhidden) ? "eye" : "eye-with-line";
        this.setState({
            passhidden: !this.state.passhidden,
            passiconname: iconname
        });
    }

    //cnf eye icon press----------------------------------------------------------------------------------------------------------------------------------------------------
    cnfpress = () => {
        let iconname = (this.state.cnfhidden) ? "eye" : "eye-with-line";
        this.setState({
            cnfhidden: !this.state.cnfhidden,
            cnficonname: iconname
        });
    }

    // animation----------------------------------------------------------------------------------------------------------------------------------------------------
    fadeanimation = () => {
        Animated.timing(this.state.fadevalue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true
        }).start()
    }

    // camera choose----------------------------------------------------------------------------------------------------------------------------------------------------
    choosecamera = () => {
        ImagePicker.openCamera({
            compressImageMaxWidth: 600,
            compressImageMaxHeight: 799,
            compressImageQuality: 1,
            cropping: true,
            cropperCircleOverlay: true,
            freeStyleCropEnabled: true,
            cropperStatusBarColor: backgroundcolor,
            cropperActiveWidgetColor: highlightcolor,
            includeBase64: true
        }).then(response => {
            this.setState({ profileimage: response });
        }).catch(err => {
            console.log(err)
        })
    }

    // gallery choose----------------------------------------------------------------------------------------------------------------------------------------------------
    choosegallery = () => {
        ImagePicker.openPicker({
            compressImageMaxWidth: 600,
            compressImageMaxHeight: 799,
            compressImageQuality: 1,
            cropping: true,
            cropperCircleOverlay: true,
            freeStyleCropEnabled: true,
            cropperStatusBarColor: backgroundcolor,
            cropperActiveWidgetColor: highlightcolor,
            includeBase64: true
        }).then(response => {
            this.setState({ profileimage: response });
        }).catch(err => {
            console.log(err)
        })
    }

    // check details----------------------------------------------------------------------------------------------------------------------------------------------------
    CheakDetails = () => {
        if (this.state.phonenumber == '' || this.state.firstname == '' || this.state.lastname == '' || this.state.email == ''
            || this.state.password == '' || this.state.confirmpass == '') {
            ToastAndroid.showWithGravity('All fields are required. It can not be empty', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
            this.setState({ signupactivebutton: false });
        }
        else {
            if (this.state.password != this.state.confirmpass) {
                ToastAndroid.showWithGravity('Password do not match with each other.', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                this.setState({ signupactivebutton: false });
            }
            else {
                const phonecheck = /^[0]?[789]\d{9}$/;
                if (phonecheck.test(this.state.phonenumber) == false) {
                    ToastAndroid.showWithGravity('Phone number is invalid. Try again !', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                    this.setState({ signupactivebutton: false });
                }
                else {
                    const emailcheck = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (emailcheck.test(String(this.state.email).toLowerCase()) == false) {
                        ToastAndroid.showWithGravity('Email ID is invalid. Try again !', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                        this.setState({ signupactivebutton: false });
                    }
                    else {
                        setTimeout(() => {
                            this.getuser();
                        }, 100);
                    }
                }
            }
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
            this.signup();
        }, 100);
    }

    // signup the user----------------------------------------------------------------------------------------------------------------------------------------------------
    signup = async () => {
        var unique = true;
        for (var i = 0; i < this.state.userdata.length; i++) {
            if (this.state.userdata[i].phonenumber == this.state.phonenumber) {
                unique = false;
            }
        }
        if (unique == true) {
            setTimeout(() => {
                this.uploadimage();
            }, 100);
        }
        else {
            setTimeout(() => {
                ToastAndroid.showWithGravity('You are already registered, Go to Login', ToastAndroid.LONG, ToastAndroid.BOTTOM);
                this.setState({
                    phonenumber: '',
                    firstname: '',
                    lastname: '',
                    email: '',
                    password: '',
                    confirmpass: '',
                    profileimage: '',
                    imageurl: null,
                    imagechoose: false,
                    signupactivebutton: false,
                    uploadimage: false,
                });
            }, 100);
            setTimeout(() => {
                this.backpress();
            }, 100);
        }
    }

    // uploading the image----------------------------------------------------------------------------------------------------------------------------------------------------
    uploadimage = () => {
        if (this.state.profileimage == '') {
            setTimeout(() => {
                this.userdetails();
            }, 100);
        }
        else {
            this.setState({ uploadimage: true });
            const image = `data:${this.state.profileimage.mime};base64,${this.state.profileimage.data}`;
            const reference = storage().ref(`profilepicture/${this.state.phonenumber}.jpg`);
            const task = reference.putString(image, storage.StringFormat.DATA_URL);
            task.then(() => {
                setTimeout(() => {
                    this.getdownloadurl();
                }, 100);
            });
        }
    }

    // get the image url----------------------------------------------------------------------------------------------------------------------------------------------------
    getdownloadurl = async () => {
        const url = await storage().ref(`profilepicture/${this.state.phonenumber}.jpg`).getDownloadURL();
        this.setState({ imageurl: url });
        setTimeout(() => {
            this.userdetails();
        }, 100);
    }

    // user details add----------------------------------------------------------------------------------------------------------------------------------------------------
    userdetails = () => {
        this.setState({ uploadimage: false });
        firestore().collection('Users').add({
            name: `${this.state.firstname} ${this.state.lastname} `,
            phonenumber: this.state.phonenumber,
            email: this.state.email,
            password: this.state.password,
            imageurl: this.state.imageurl
        }).then(async () => {
            let userinfo = [
                ['logincode', 'user do not logout'],
                ['name', `${this.state.firstname} ${this.state.lastname} `],
                ['phonenumber', this.state.phonenumber],
                ['email', this.state.email],
                ['password', this.state.password],
                ['profilepicture', this.state.imageurl],
            ];
            await AsyncStorage.multiSet(userinfo);
            setTimeout(() => {
                ToastAndroid.showWithGravity(`Welcome to Mediator`, ToastAndroid.LONG, ToastAndroid.BOTTOM);
            }, 100);
            setTimeout(() => {
                this.setState({
                    phonenumber: '',
                    firstname: '',
                    lastname: '',
                    email: '',
                    password: '',
                    confirmpass: '',
                    profileimage: '',
                    imageurl: null,
                    imagechoose: false,
                    signupactivebutton: false,
                    uploadimage: false,
                });
                this.props.navigation.navigate('Homepage');
            }, 100);
        });
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
                        Create an Account
                    </Text>
                </View>

                <View style={{ padding: widthsize * 3 / 100 }}>
                    <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 3 / 100, textAlign: 'center' }}>
                        Enter your details to get register into Mediator
                    </Text>
                </View>

                {/* back button */}
                <TouchableHighlight delayPressIn={0} activeOpacity={0.5}
                    underlayColor={buttonbackground}
                    style={{
                        alignItems: "center", position: 'absolute', width: widthsize * 10 / 100, height: widthsize * 10 / 100, borderRadius: (widthsize * 10 / 100) / 2,
                        top: heightsize * 2.5 / 100, left: widthsize * 3 / 100, justifyContent: 'center'
                    }}
                    onPress={() => this.backpress()}>
                    <Backicon name='arrow-back' size={widthsize * 6 / 100} color={highlightcolor} />
                </TouchableHighlight>

                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>

                    {/* profile picture */}
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        {
                            this.state.profileimage == ''
                                ?
                                <TouchableOpacity delayPressIn={0} activeOpacity={0.5}
                                    onPress={() => {
                                        this.setState({ imagechoose: true });
                                        this.fadeanimation();
                                    }}
                                    style={{
                                        height: heightsize * 16 / 100, width: heightsize * 16 / 100, borderRadius: (heightsize * 16 / 100) / 2,
                                        borderColor: highlightcolor, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginTop: heightsize * 3 / 100
                                    }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <Usericon name='user'
                                            size={widthsize * 15 / 100}
                                            color={highlightcolor} />
                                        <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 2 / 100 }}>
                                            Add Profile Picture
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity delayPressIn={0} activeOpacity={0.5}
                                    onPress={() => {
                                        this.setState({ imagechoose: true });
                                        this.fadeanimation();
                                    }}>
                                    <Image
                                        source={{ uri: `data:${this.state.profileimage.mime};base64,${this.state.profileimage.data}` }}
                                        indicator={UIActivityIndicator}
                                        indicatorProps={{
                                            size: widthsize * 5 / 100,
                                            color: highlightcolor,
                                        }}
                                        style={{
                                            width: heightsize * 16 / 100, height: heightsize * 16 / 100, borderColor: highlightcolor,
                                            borderRadius: (heightsize * 16 / 100) / 2, overflow: 'hidden', borderWidth: 1, marginTop: heightsize * 3 / 100,
                                        }} />
                                </TouchableOpacity>
                        }
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

                    {/* first name */}
                    <View style={{ marginTop: heightsize * 3 / 100, alignItems: 'center' }}>
                        <TextInput
                            placeholder='First Name'
                            placeholderTextColor={highlightcolor}
                            value={this.state.firstname}
                            onChangeText={(text) => this.setState({ firstname: text.replace(/\s/g, '') })}
                            style={{
                                width: widthsize * 90 / 100, height: heightsize * 7 / 100, backgroundColor: buttonbackground, borderRadius: widthsize * 3 / 100,
                                color: textcolor, paddingLeft: widthsize * 3 / 100
                            }} />
                    </View>

                    {/* last name */}
                    <View style={{ marginTop: heightsize * 3 / 100, alignItems: 'center' }}>
                        <TextInput
                            placeholder='Last Name'
                            placeholderTextColor={highlightcolor}
                            value={this.state.lastname}
                            onChangeText={(text) => this.setState({ lastname: text.replace(/\s/g, '') })}
                            style={{
                                width: widthsize * 90 / 100, height: heightsize * 7 / 100, backgroundColor: buttonbackground, borderRadius: widthsize * 3 / 100,
                                color: textcolor, paddingLeft: widthsize * 3 / 100
                            }} />
                    </View>

                    {/* email id */}
                    <View style={{ marginTop: heightsize * 3 / 100, alignItems: 'center' }}>
                        <TextInput
                            placeholder='Email ID'
                            placeholderTextColor={highlightcolor}
                            value={this.state.email}
                            onChangeText={(text) => this.setState({ email: text.replace(/\s/g, '') })}
                            style={{
                                width: widthsize * 90 / 100, height: heightsize * 7 / 100, backgroundColor: buttonbackground, borderRadius: widthsize * 3 / 100,
                                color: textcolor, paddingLeft: widthsize * 3 / 100
                            }} />
                    </View>

                    {/* password */}
                    <View style={{ marginTop: heightsize * 3 / 100, alignItems: 'center', flexDirection: 'row' }}>
                        <TextInput
                            placeholder='Password'
                            secureTextEntry={this.state.passhidden}
                            placeholderTextColor={highlightcolor}
                            value={this.state.password}
                            onChangeText={(text) => this.setState({ password: text.replace(/\s/g, '') })}
                            style={{
                                width: widthsize * 75 / 100, height: heightsize * 7 / 100, backgroundColor: buttonbackground, borderRadius: widthsize * 3 / 100,
                                color: textcolor, borderTopRightRadius: 0, borderBottomRightRadius: 0, paddingLeft: widthsize * 3 / 100
                            }} />
                        <TouchableOpacity delayPressIn={0}
                            onPress={() => this.passpress()}
                            style={{
                                width: widthsize * 15 / 100, height: heightsize * 7 / 100, backgroundColor: buttonbackground, borderRadius: widthsize * 3 / 100,
                                borderBottomLeftRadius: 0, borderTopLeftRadius: 0, alignItems: 'center', justifyContent: 'center'
                            }} >
                            <Icon name={this.state.passiconname}
                                size={widthsize * 4 / 100}
                                color={highlightcolor}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* confirm password */}
                    <View style={{ marginTop: heightsize * 3 / 100, alignItems: 'center', flexDirection: 'row' }}>
                        <TextInput
                            placeholder='Confirm Password'
                            secureTextEntry={this.state.cnfhidden}
                            placeholderTextColor={highlightcolor}
                            value={this.state.confirmpass}
                            onChangeText={(text) => this.setState({ confirmpass: text.replace(/\s/g, '') })}
                            style={{
                                width: widthsize * 75 / 100, height: heightsize * 7 / 100, backgroundColor: buttonbackground, borderRadius: widthsize * 3 / 100,
                                color: textcolor, borderTopRightRadius: 0, borderBottomRightRadius: 0, paddingLeft: widthsize * 3 / 100
                            }} />
                        <TouchableOpacity delayPressIn={0}
                            onPress={() => this.cnfpress()}
                            style={{
                                width: widthsize * 15 / 100, height: heightsize * 7 / 100, backgroundColor: buttonbackground, borderRadius: widthsize * 3 / 100,
                                borderBottomLeftRadius: 0, borderTopLeftRadius: 0, alignItems: 'center', justifyContent: 'center'
                            }} >
                            <Icon name={this.state.cnficonname}
                                size={widthsize * 4 / 100}
                                color={highlightcolor}
                            />
                        </TouchableOpacity>
                    </View>


                    {/* signup button */}
                    {
                        this.state.signupactivebutton == false
                            ?
                            <View style={{ marginTop: heightsize * 3 / 100, alignItems: 'center', justifyContent: 'center', marginBottom: heightsize * 3 / 100 }}>
                                <TouchableOpacity delayPressIn={0} onPress={() => {
                                    Keyboard.dismiss();
                                    this.setState({ signupactivebutton: true });
                                    setTimeout(() => {
                                        this.CheakDetails();
                                    }, 1000);
                                }}
                                    activeOpacity={0.5}
                                    style={{
                                        width: widthsize * 40 / 100, backgroundColor: statusbarcolor, alignItems: 'center', justifyContent: 'center',
                                        borderRadius: widthsize * 3 / 100, height: heightsize * 6 / 100
                                    }}>
                                    <Text style={{ color: textcolor, fontSize: widthsize * 3 / 100 }}> Sign Up </Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={{ marginTop: heightsize * 3 / 100, alignItems: 'center', justifyContent: 'center', marginBottom: heightsize * 3 / 100 }}>
                                <TouchableOpacity disabled={true}
                                    style={{
                                        width: widthsize * 40 / 100, backgroundColor: statusbarcolor, alignItems: 'center', justifyContent: 'center',
                                        borderRadius: widthsize * 3 / 100, height: heightsize * 6 / 100
                                    }}>
                                    <DotIndicator color={textcolor} size={widthsize * 1 / 100} />
                                </TouchableOpacity>
                            </View>
                    }
                    {/* <View style={{ height: this.state.height }} /> */}

                </ScrollView>
                {
                    this.state.imagechoose == true ?
                        <TouchableWithoutFeedback onPress={() => this.setState({ imagechoose: false })}>

                            <View style={{ flex: 1, justifyContent: 'center', width: widthsize, backgroundColor: 'rgba(0,0,0,0.8)', height: heightsize, position: 'absolute', padding: widthsize * 3 / 100 }}>
                                <TouchableWithoutFeedback onPress={() => this.setState({ imagechoose: true })}>

                                    <Animated.View style={{ height: '20%', backgroundColor: buttonbackground, padding: widthsize * 5 / 100, opacity: this.state.fadevalue }}>

                                        <View style={{ height: '15%' }}>
                                            <Text allowFontScaling={false} style={{ color: highlightcolor, fontWeight: 'bold', fontSize: widthsize * 3.5 / 100 }}>
                                                Select Profile Picture
                                            </Text>
                                        </View>

                                        <View style={{ height: '30%' }} />
                                        <TouchableOpacity onPress={() => { setTimeout(() => { this.choosecamera(); this.setState({ imagechoose: false }) }, 500); }}
                                            activeOpacity={0.5} style={{ width: '50%' }}>
                                            <View style={{ height: '15%', flexDirection: 'row', alignItems: 'center' }}>
                                                <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 3 / 100, fontWeight: 'bold', marginLeft: widthsize * 2 / 100 }}>
                                                    Take Photo
                                                </Text>
                                            </View>
                                        </TouchableOpacity>

                                        <View style={{ height: '20%' }} />
                                        <TouchableOpacity onPress={() => { setTimeout(() => { this.choosegallery(); this.setState({ imagechoose: false }) }, 500); }}
                                            activeOpacity={0.5} style={{ paddingTop: '1%', width: '50%' }}>
                                            <View style={{ height: '15%', flexDirection: 'row', alignItems: 'center' }}>
                                                <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 3 / 100, fontWeight: 'bold', marginLeft: widthsize * 2 / 100 }}>
                                                    Choose from Gallery
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Animated.View>
                                </TouchableWithoutFeedback>

                            </View>
                        </TouchableWithoutFeedback>
                        :
                        <View />
                }
                {
                    this.state.uploadimage == true ?
                        <View style={{ flex: 1, justifyContent: 'center', width: '100%', backgroundColor: 'rgba(0,0,0,0.8)', height: '100%', position: 'absolute' }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <UIActivityIndicator color={highlightcolor} size={widthsize * 8 / 100} count={10} />
                                <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 2 / 100, marginTop: heightsize * 5 / 100 }}>
                                    Uploading the profile picture
                                </Text>
                            </View>
                        </View>
                        :
                        <View />
                }
            </View >
        );
    }
}
