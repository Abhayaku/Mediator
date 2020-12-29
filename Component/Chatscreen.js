import React, { Component } from 'react';
import {
    View, Text, TouchableHighlight, ActivityIndicator, BackHandler,
    ImageBackground
} from 'react-native';
import Image from 'react-native-image-progress';
import { UIActivityIndicator } from 'react-native-indicators';
import Backicon from 'react-native-vector-icons/AntDesign';
import Lockicon from 'react-native-vector-icons/MaterialCommunityIcons';
import Sendicon from 'react-native-vector-icons/MaterialCommunityIcons';
import Scrollicon from 'react-native-vector-icons/MaterialCommunityIcons';
import UserIcon from 'react-native-vector-icons/FontAwesome';
import { GiftedChat, Bubble, Send, InputToolbar, Time } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Chatscreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: [
                {
                    _id: 0,
                    text: `Welcome to Chat with ${this.props.route.params.title.name}`,
                    createdAt: new Date().getTime(),
                    system: true
                }
            ],
            name: '',
            phonenumber: '',
            doc: '',
        };
    }

    // mount-------------------------------------------------------------------------------------------------------------------------------
    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backpress);
        const phonenumber = await AsyncStorage.getItem('phonenumber');
        const name = await AsyncStorage.getItem('name');
        this.setState({ name: name, phonenumber: phonenumber });
        firestore().collection('Mediator').doc(phonenumber).collection("Chatroom").doc(this.props.route.params.title._id).collection('Message')
            .orderBy('createdAt', 'desc').onSnapshot(querySnapshot => {
                const message = querySnapshot.docs.map(doc => {
                    const firebaseData = doc.data();
                    const data = {
                        _id: doc.id,
                        text: '',
                        createdAt: new Date().getTime(),
                        ...firebaseData
                    };

                    if (!firebaseData.system) {
                        data.user = {
                            ...firebaseData.user,
                            name: firebaseData.user.name
                        };
                    }
                    return data;
                });
                this.setState({ message: message });
            });
        setTimeout(() => {
            firestore().collection('Mediator').doc(this.props.route.params.title.phonenumber).collection("Chatroom").onSnapshot(querySnapshot => {
                querySnapshot.docs.map(doc => {
                    if (doc._data.name == name) {
                        this.setState({ doc: doc.id, });
                    }
                });
            });
        }, 1000);
    }

    // back press--------------------------------------------------------------------------------------------------------
    backpress = () => {
        if (this.state.message[0].text == `Sender`) {
            firestore().collection('Mediator').doc(this.state.phonenumber).collection("Chatroom").doc(this.props.route.params.title._id).delete()
                .then(() => {
                    setTimeout(() => {
                        this.props.navigation.navigate("Homepage");
                    }, 200);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        else {
            setTimeout(() => {
                this.props.navigation.navigate("Homepage");
            }, 200);
        }
        return true;
    }


    // render chat bubble------------------------------------------------------------------------------------------------------
    renderBubble = props => {
        return (
            <Bubble {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: statusbarcolor,
                        borderRadius: widthsize * 3 / 100,
                        padding: widthsize * 1 / 100
                    },
                    left: {
                        backgroundColor: textcolor,
                        borderRadius: widthsize * 3 / 100,
                        padding: widthsize * 1 / 100
                    }
                }}
                textStyle={{
                    right: {
                        color: textcolor,
                        fontSize: widthsize * 3 / 100,
                    },
                    left: {
                        color: statusbarcolor,
                        fontSize: widthsize * 3 / 100,
                    }
                }}
            />
        );
    }

    // render time text--------------------------------------------------------------------------------------------
    renderTime = (props) => {
        return (
            <Time
                {...props}
                timeTextStyle={{
                    left: {
                        color: statusbarcolor,
                    },
                    right: {
                        color: textcolor,
                    },
                }}
            />
        );
    };

    // custom input box--------------------------------------------------------------------------------------------
    customtInputToolbar = props => {
        return (
            <InputToolbar
                {...props}
                containerStyle={{
                    backgroundColor: topheader,
                    borderTopWidth: 0,
                    paddingLeft: widthsize * 3 / 100,
                    padding: widthsize * 2 / 100,
                    justifyContent: "center",
                }}
                textInputStyle={{ color: textcolor }}
            />
        );
    };

    // custom system message--------------------------------------------------------------------------------------------
    customSystemMessage = () => {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', padding: widthsize * 4 / 100, }}>
                <View style={{ flexDirection: 'row' }}>
                    <Lockicon name="lock" color={highlightcolor} size={widthsize * 2 / 100} />
                    <Text allowFontScaling={false} style={{
                        color: highlightcolor, fontSize: widthsize * 2 / 100, marginLeft: widthsize * 1 / 100,
                        textAlign: 'center'
                    }}>
                        Your chat is end to end encrypted. Remember to be cautious about what you share with others.
                    </Text>
                </View>
                <Text allowFontScaling={false} style={{
                    color: textcolor, fontSize: widthsize * 2 / 100, marginTop: heightsize * 1 / 100,
                    textAlign: 'center'
                }}>
                    You have joined the chat with {this.props.route.params.title.name}
                </Text>
            </View>
        );
    };

    // custom send--------------------------------------------------------------------------------------------
    renderSend(props) {
        return (
            <Send {...props}>
                <Sendicon name='send-circle' size={widthsize * 13 / 100} color={highlightcolor} />
            </Send >
        );
    }

    // custom scroll--------------------------------------------------------------------------------------------
    scrollcomponent = () => {
        return (
            <Scrollicon name='chevron-double-down' size={widthsize * 5 / 100} color={highlightcolor} />
        );
    }

    // custom loading--------------------------------------------------------------------------------------------
    loadingrender = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='large' color={highlightcolor} />
            </View>
        );
    }

    // first welcome message----------------------------------------------------------------------------------------------
    welcomemessage = async (newMessage) => {
        const phonenumber = await AsyncStorage.getItem('phonenumber');
        const name = await AsyncStorage.getItem('name');
        const profilepicture = await AsyncStorage.getItem('profilepicture');

        // receiver room
        firestore().collection('Mediator').doc(this.props.route.params.title.phonenumber).collection("Chatroom").add({
            name: name,
            phonenumber: phonenumber,
            imageurl: profilepicture,
            latestMessage: {
                text: `Receiver`,
                createdAt: new Date().getTime()
            }
        }).then(docRef => {
            docRef.collection('Message').add({
                text: `Receiver`,
                createdAt: new Date().getTime(),
                system: true
            });
        });
        setTimeout(() => {
            this.handleSend(newMessage)
        }, 100);
    }

    // send function-------------------------------------------------------------------------------------------------------------
    handleSend = async (newMessage = []) => {
        this.setState(previousState => ({
            message: GiftedChat.append(previousState.message, newMessage)
        }));
        const phonenumber = await AsyncStorage.getItem('phonenumber');
        const text = newMessage[0].text;

        // receiver db update
        firestore().collection('Mediator').doc(this.props.route.params.title.phonenumber).collection("Chatroom")
            .doc(this.state.doc).collection('Message')
            .add({
                text,
                createdAt: new Date().getTime(),
                user: {
                    _id: phonenumber,
                    name: this.state.name,
                }
            });
        await firestore()
        firestore().collection('Mediator').doc(this.props.route.params.title.phonenumber).collection("Chatroom")
            .doc(this.state.doc).set(
                {
                    latestMessage: {
                        text,
                        createdAt: new Date().getTime()
                    }
                },
                { merge: true }
            );

        // sender db update
        firestore().collection('Mediator').doc(phonenumber).collection("Chatroom").doc(this.props.route.params.title._id).collection('Message')
            .add({
                text,
                createdAt: new Date().getTime(),
                user: {
                    _id: phonenumber,
                    name: this.state.name,
                }
            });
        await firestore()
        firestore().collection('Mediator').doc(phonenumber).collection("Chatroom").doc(this.props.route.params.title._id)
            .set(
                {
                    latestMessage: {
                        text,
                        createdAt: new Date().getTime()
                    }
                },
                { merge: true }
            );
    }

    // unmount----------------------------------------------------------------------------------------------------------------------------------------------
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backpress);
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: backgroundcolor }} >

                {/* header */}
                <View style={{ backgroundColor: topheader, height: heightsize * 9 / 100, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableHighlight onPress={() => this.backpress()} activeOpacity={0.9} delayPressIn={0}
                        underlayColor={buttonbackground}
                        style={{ marginLeft: widthsize * 2 / 100, padding: widthsize * 2 / 100, borderRadius: widthsize * 10 / 100 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Backicon name='arrowleft'
                                size={widthsize * 5 / 100}
                                color={highlightcolor}>
                            </Backicon>
                            {
                                this.props.route.params.title.imageurl == 'No Photo'
                                    ?
                                    <View style={{
                                        alignItems: 'center', justifyContent: 'center', width: widthsize * 9 / 100, height: widthsize * 9 / 100,
                                        borderRadius: (widthsize * 9 / 100) / 2, borderColor: highlightcolor, borderWidth: 1, marginLeft: widthsize * 2 / 100,
                                    }}>
                                        <UserIcon name='user'
                                            size={widthsize * 5 / 100}
                                            color={highlightcolor} />
                                    </View>
                                    :
                                    <Image
                                        source={{ uri: this.props.route.params.title.imageurl }}
                                        indicator={UIActivityIndicator}
                                        indicatorProps={{
                                            size: widthsize * 1.5 / 100,
                                            color: highlightcolor,
                                        }}
                                        style={{
                                            width: widthsize * 9 / 100, height: widthsize * 9 / 100, borderColor: highlightcolor,
                                            borderRadius: (widthsize * 9 / 100) / 2, overflow: 'hidden', borderWidth: 1, marginLeft: widthsize * 2 / 100,
                                        }} />
                            }
                        </View>
                    </TouchableHighlight>
                    <View style={{ marginLeft: widthsize * 2 / 100, }}>
                        <Text allowFontScaling={false} style={{ color: highlightcolor, fontSize: widthsize * 3.5 / 100, letterSpacing: 2 }}>
                            {this.props.route.params.title.name}
                        </Text>
                    </View>
                </View>

                {/* chat  */}
                <ImageBackground
                    source={require("./Image/chatwallpaper.jpg")}
                    resizeMode="cover"
                    style={{ flex: 1 }}>
                    <GiftedChat
                        messages={this.state.message}
                        placeholder='Type your message here...'
                        onSend={newMessage => {
                            if (this.state.message[0].text == `Sender`) {
                                this.welcomemessage(newMessage);
                            }
                            else {
                                this.handleSend(newMessage)
                            }
                        }}
                        user={{ _id: this.state.phonenumber, name: this.state.name }}
                        renderInputToolbar={props => this.customtInputToolbar(props)}
                        renderSystemMessage={this.customSystemMessage}
                        renderTime={props => this.renderTime(props)}
                        renderBubble={this.renderBubble}
                        renderSend={this.renderSend}
                        scrollToBottomComponent={this.scrollcomponent}
                        renderLoading={this.loadingrender}
                        renderFooter={() => {
                            return (
                                <View style={{ height: heightsize * 4 / 100 }} />
                            );
                        }}
                        renderAvatar={null}
                        scrollToBottom
                        alwaysShowSend
                        isTyping
                    />
                </ImageBackground>
            </View >
        );
    }
}
