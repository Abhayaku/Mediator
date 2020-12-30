import React, { Component } from 'react';
import {
    View, BackHandler, TouchableHighlight, Text, Animated,
    TouchableWithoutFeedback, TouchableOpacity
} from 'react-native';
import Image from 'react-native-image-progress';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Backicon from 'react-native-vector-icons/AntDesign';
import Editicon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UIActivityIndicator, PacmanIndicator } from 'react-native-indicators';
import ImagePicker from 'react-native-image-crop-picker';

export default class Profileview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imagechoose: false,
            profileimage: '',
            fadevalue: new Animated.Value(0),
            uploadimage: false,
            docid: '',
            change: false,
            logout: false
        };
    }

    // mount----------------------------------------------------------------------------------------------------------------------------------------------
    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backpress);
        const name = await AsyncStorage.getItem('name');
        const imageurl = await AsyncStorage.getItem('profilepicture');
        this.setState({ name, imageurl });
    }

    // back press-----------------------------------------------------------------------
    backpress = () => {
        if (this.state.change == false) {
            this.props.navigation.goBack();
            return true;
        }
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
            this.setState({ profileimage: response, uploadimage: true });
            setTimeout(() => {
                this.getid();
            }, 100);
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
            this.setState({ profileimage: response, uploadimage: true });
            setTimeout(() => {
                this.getid();
            }, 100);
        }).catch(err => {
            console.log(err)
        })
    }

    // get user id----------------------------------------------------------------------------------------------------------------------------------------------------
    getid = async () => {
        const phonenumber = await AsyncStorage.getItem('phonenumber');
        firestore().collection('Users').onSnapshot(querySnapshot => {
            querySnapshot.docs.map(doc => {
                if (doc._data.phonenumber == phonenumber) {
                    this.setState({ docid: doc.id });
                }
            });
            setTimeout(async () => {
                const phonenumber = await AsyncStorage.getItem('phonenumber');
                storage().ref(`profilepicture/${phonenumber}.jpg`).delete().then(async () => {
                    await AsyncStorage.removeItem('profilepicture');
                    this.uploadimage();
                });
            }, 100);
        });
    }

    // uploading the image----------------------------------------------------------------------------------------------------------------------------------------------------
    uploadimage = async () => {
        const phonenumber = await AsyncStorage.getItem('phonenumber');
        const image = `data:${this.state.profileimage.mime};base64,${this.state.profileimage.data}`;
        const reference = storage().ref(`profilepicture/${phonenumber}.jpg`);
        const task = reference.putString(image, storage.StringFormat.DATA_URL);
        task.then(() => {
            setTimeout(() => {
                this.getdownloadurl();
            }, 100);
        });
    }

    // get the image url----------------------------------------------------------------------------------------------------------------------------------------------------
    getdownloadurl = async () => {
        const phonenumber = await AsyncStorage.getItem('phonenumber');
        const url = await storage().ref(`profilepicture/${phonenumber}.jpg`).getDownloadURL();
        this.setState({ imageurl: url });
        setTimeout(async () => {
            await AsyncStorage.setItem('profilepicture', this.state.imageurl);
            firestore().collection("Users").doc(this.state.docid).update({ imageurl: this.state.imageurl });
        }, 100);
        setTimeout(() => {
            this.setState({ uploadimage: false, change: true });
        }, 500);
    }

    // user logout----------------------------------------------------------------------------------------------------------------------------------------------
    logout = () => {
        this.setState({ logout: true });
        setTimeout(async () => {
            let userdata = [
                'logincode', 'name', 'phonenumber', 'email', 'password', 'profilepicture'
            ];
            await AsyncStorage.multiRemove(userdata).then(() => {
                setTimeout(() => {
                    this.setState({ logout: false, change: false });
                    this.props.navigation.navigate("Login");
                }, 1000);
            })
        }, 2000);
    }

    // Unmount----------------------------------------------------------------------------------------------------------------------------------------------
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backpress);
    }

    render() {
        if (this.state.change) {
            if (this.state.logout) {
                return (
                    <View style={{ flex: 1, backgroundColor: 'black' }}>
                        <View style={{ flex: 1, justifyContent: 'center', width: '100%', backgroundColor: 'rgba(0,0,0,0.9)', height: '100%', position: 'absolute' }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <PacmanIndicator color={highlightcolor} size={widthsize * 10 / 100} count={10} />
                            </View>
                        </View>
                    </View>
                )
            }
            else {
                return (
                    <View style={{ flex: 1, backgroundColor: 'black' }}>
                        <View style={{ flex: 1, justifyContent: 'center', width: widthsize, backgroundColor: 'rgba(0,0,0,0.9)', height: heightsize, position: 'absolute', padding: widthsize * 3 / 100 }}>
                            <View style={{ height: '20%', backgroundColor: buttonbackground, padding: widthsize * 5 / 100 }}>
                                <View style={{ height: '20%' }}>
                                    <Text allowFontScaling={false} style={{ color: highlightcolor, fontWeight: 'bold', fontSize: widthsize * 3 / 100, letterSpacing: 1 }}>
                                        Profile Uploaded
                                    </Text>
                                </View>
                                <View style={{ height: '20%' }} />
                                <View style={{ height: '20%', flexDirection: 'row', alignItems: 'center' }}>
                                    <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 2.5 / 100, letterSpacing: 1 }}>
                                        Please log out to see the changes you made
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
                                                Log Out
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                )
            }
        }
        return (
            <View style={{ flex: 1, backgroundColor: 'black' }}>

                {/* header */}
                < View style={{
                    height: heightsize * 9 / 100, alignItems: 'center', flexDirection: 'row'
                }}>
                    <TouchableHighlight onPress={() => this.backpress()} activeOpacity={0.9} delayPressIn={0}
                        underlayColor={buttonbackground}
                        style={{ marginLeft: widthsize * 2 / 100, padding: widthsize * 4 / 100, borderRadius: widthsize * 10 / 100 }}>
                        <Backicon name='arrowleft'
                            size={widthsize * 5 / 100}
                            color={highlightcolor} />
                    </TouchableHighlight>
                    <View style={{ flex: 1, marginLeft: widthsize * 2 / 100 }}>
                        <Text allowFontScaling={false} style={{ color: highlightcolor, fontSize: widthsize * 3.5 / 100, letterSpacing: 2 }}>
                            {this.state.name}
                        </Text>
                    </View>
                    <TouchableHighlight onPress={() => {
                        this.setState({ imagechoose: true });
                        this.fadeanimation();
                    }} activeOpacity={0.9} delayPressIn={0}
                        underlayColor={buttonbackground}
                        style={{ marginRight: widthsize * 2 / 100, padding: widthsize * 4 / 100, borderRadius: widthsize * 10 / 100 }}>
                        <Editicon name='edit'
                            size={widthsize * 4 / 100}
                            color={highlightcolor} />
                    </TouchableHighlight>
                </View >

                {/* image view */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={{ uri: this.state.imageurl }}
                        indicator={UIActivityIndicator}
                        indicatorProps={{
                            size: widthsize * 7 / 100,
                            color: highlightcolor,
                        }}
                        style={{ width: widthsize, height: widthsize }}
                    />
                </View>
                {
                    this.state.imagechoose == true ?
                        <TouchableWithoutFeedback onPress={() => this.setState({ imagechoose: false })}>

                            <View style={{ flex: 1, justifyContent: 'center', width: widthsize, backgroundColor: 'rgba(0,0,0,0.9)', height: heightsize, position: 'absolute', padding: widthsize * 3 / 100 }}>
                                <TouchableWithoutFeedback onPress={() => this.setState({ imagechoose: true })}>

                                    <Animated.View style={{ height: '20%', backgroundColor: buttonbackground, padding: widthsize * 5 / 100, opacity: this.state.fadevalue }}>

                                        <View style={{ height: '15%' }}>
                                            <Text allowFontScaling={false} style={{ color: highlightcolor, fontWeight: 'bold', fontSize: widthsize * 3 / 100, letterSpacing: 1 }}>
                                                Select Profile Picture
                                            </Text>
                                        </View>

                                        <View style={{ height: '30%' }} />
                                        <TouchableOpacity onPress={() => { setTimeout(() => { this.choosecamera(); this.setState({ imagechoose: false }) }, 500); }}
                                            activeOpacity={0.5} style={{ width: '50%' }}>
                                            <View style={{ height: '15%', flexDirection: 'row', alignItems: 'center' }}>
                                                <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 2.5 / 100, marginLeft: widthsize * 2 / 100, letterSpacing: 1 }}>
                                                    Take Photo
                                                </Text>
                                            </View>
                                        </TouchableOpacity>

                                        <View style={{ height: '20%' }} />
                                        <TouchableOpacity onPress={() => { setTimeout(() => { this.choosegallery(); this.setState({ imagechoose: false }) }, 500); }}
                                            activeOpacity={0.5} style={{ paddingTop: '1%', width: '50%' }}>
                                            <View style={{ height: '15%', flexDirection: 'row', alignItems: 'center' }}>
                                                <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 2.5 / 100, marginLeft: widthsize * 2 / 100, letterSpacing: 1 }}>
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
                        <View style={{ flex: 1, justifyContent: 'center', width: '100%', backgroundColor: 'rgba(0,0,0,0.9)', height: '100%', position: 'absolute' }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <UIActivityIndicator color={highlightcolor} size={widthsize * 8 / 100} count={12} />
                                <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 2 / 100, marginTop: heightsize * 5 / 100, letterSpacing: 1 }}>
                                    Uploading the profile picture
                                </Text>
                            </View>
                        </View>
                        :
                        <View />
                }
            </View>
        );
    }
}