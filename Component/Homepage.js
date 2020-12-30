import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity, FlatList, TouchableHighlight,
    BackHandler, RefreshControl
} from 'react-native';
import Image from 'react-native-image-progress';
import Settingicon from 'react-native-vector-icons/Ionicons';
import { UIActivityIndicator } from 'react-native-indicators';
import UserIcon from 'react-native-vector-icons/FontAwesome';
import MediatoreIcon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

export default class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatlist: [],
            Showindicator: true,
            refreshing: false,
        };
    }

    // mount----------------------------------------------------------------------------------------------------------------------------------------------
    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backpress);
        const phonenumber = await AsyncStorage.getItem('phonenumber');
        firestore().collection('Mediator').doc(phonenumber).collection("Chatroom").orderBy('latestMessage.createdAt', 'desc').onSnapshot(querySnapshot => {
            const threads = querySnapshot.docs.map(documentSnapshot => {
                return {
                    _id: documentSnapshot.id,
                    name: '',
                    latestMessage: {
                        text: ''
                    },
                    ...documentSnapshot.data()
                };
            });
            this.setState({ chatlist: threads });
            setTimeout(() => {
                var chatlist = this.state.chatlist.filter(function (data) {
                    return data.latestMessage.text != 'Sender';
                });
                this.setState({ chatlist: chatlist });
            }, 500);
            setTimeout(() => {
                this.setState({ Showindicator: false, refreshing: false, });
            }, 500);
        });
    }

    // backpress----------------------------------------------------------------------------------------------------------------------------------------------
    backpress = () => {
        BackHandler.exitApp();
        return true;
    }

    // user click on chat----------------------------------------------------------------------------------------------------------------------------------------------
    chatclick = (title) => {
        this.props.navigation.navigate('Chatscreen', { title: title });
    }

    // refersh----------------------------------------------------------------------------------------------------------------------------------------------
    onRefresh = () => {
        this.setState({ refreshing: true });
        setTimeout(() => {
            this.componentDidMount();
        }, 1000);
    }

    // unmount----------------------------------------------------------------------------------------------------------------------------------------------
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backpress);
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: backgroundcolor }} >

                {/* header */}
                <View style={{
                    backgroundColor: topheader, height: heightsize * 10 / 100, alignItems: 'center',
                    flexDirection: 'row', justifyContent: 'space-between'
                }}>
                    <View style={{ marginLeft: widthsize * 4 / 100 }}>
                        <Text allowFontScaling={false} style={{ color: highlightcolor, fontSize: widthsize * 5 / 100, letterSpacing: 2 }}>
                            Mediator
                        </Text>
                    </View>
                    <TouchableHighlight onPress={() => {
                        this.props.navigation.navigate("Setting");
                    }} activeOpacity={0.9} delayPressIn={0} underlayColor={buttonbackground}
                        style={{ marginRight: widthsize * 3 / 100, padding: widthsize * 3 / 100, borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
                        <Settingicon name='settings'
                            size={widthsize * 7 / 100}
                            color={highlightcolor} />
                    </TouchableHighlight>
                </View>
                {
                    this.state.Showindicator == true
                        ?
                        <View style={{ flex: 1, backgroundColor: backgroundcolor, alignItems: "center", justifyContent: 'center' }}>
                            <UIActivityIndicator color={highlightcolor} size={widthsize * 5 / 100} count={12} />
                        </View>
                        :
                        <View style={{ flex: 1, backgroundColor: backgroundcolor }}>
                            {
                                this.state.chatlist.length == 0
                                    ?
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 3 / 100, textAlign: 'center', letterSpacing: 1 }}>
                                            There is  no chat to show
                                        </Text>
                                        <Text allowFontScaling={false} style={{ color: highlightcolor, fontSize: widthsize * 2.5 / 100, textAlign: 'center', marginTop: 5, letterSpacing: 1 }}>
                                            Tap on the below icon and initiate the chat with others
                                         </Text>
                                    </View>
                                    :
                                    <FlatList
                                        data={this.state.chatlist}
                                        style={{ flex: 1 }}
                                        refreshControl={
                                            <RefreshControl
                                                colors={[highlightcolor, highlightcolor]}
                                                progressBackgroundColor={buttonbackground}
                                                refreshing={this.state.refreshing}
                                                onRefresh={this.onRefresh}
                                            />
                                        }
                                        renderItem={({ item }) => (
                                            <TouchableHighlight activeOpacity={0.7} delayPressIn={0} onPress={() => this.chatclick(item)}
                                                underlayColor={buttonbackground}>
                                                <View style={{ padding: widthsize * 3 / 100, borderBottomWidth: 0.5, borderColor: buttonbackground, }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        {
                                                            item.imageurl == 'No Photo'
                                                                ?
                                                                <View style={{
                                                                    alignItems: 'center', justifyContent: 'center', width: widthsize * 12 / 100, height: widthsize * 12 / 100,
                                                                    borderRadius: (widthsize * 12 / 100) / 2, borderColor: highlightcolor, borderWidth: 1
                                                                }}>
                                                                    <UserIcon name='user'
                                                                        size={widthsize * 6 / 100}
                                                                        color={highlightcolor} />
                                                                </View>
                                                                :
                                                                <Image
                                                                    source={{ uri: item.imageurl }}
                                                                    indicator={UIActivityIndicator}
                                                                    indicatorProps={{
                                                                        size: widthsize * 1.5 / 100,
                                                                        color: highlightcolor,
                                                                    }}
                                                                    style={{
                                                                        width: widthsize * 12 / 100, height: widthsize * 12 / 100, borderColor: highlightcolor,
                                                                        borderRadius: (widthsize * 12 / 100) / 2, overflow: 'hidden', borderWidth: 1
                                                                    }} />
                                                        }
                                                        <View style={{ flex: 1, marginLeft: widthsize * 3 / 100 }}>
                                                            <Text allowFontScaling={false} style={{ color: highlightcolor, fontSize: widthsize * 3 / 100, letterSpacing: 1 }}>
                                                                {item.name}
                                                            </Text>
                                                            <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 2 / 100, opacity: 0.5, marginTop: 5, letterSpacing: 0.5 }}>
                                                                {item.latestMessage.text}
                                                            </Text>
                                                        </View>
                                                        <View style={{ marginRight: widthsize * 3 / 100 }}>
                                                            {
                                                                new Date(item.latestMessage.createdAt).getHours() > new Date().getHours()
                                                                    ?
                                                                    <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 2 / 100, letterSpacing: 1 }}>
                                                                        Yesterday
                                                                    </Text>
                                                                    :
                                                                    <View>
                                                                        {
                                                                            new Date(item.latestMessage.createdAt).getDate() < new Date().getDate()
                                                                                ?
                                                                                <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 2 / 100, letterSpacing: 1 }}>
                                                                                    {new Date(item.latestMessage.createdAt).getDate()}/{new Date(item.latestMessage.createdAt).getMonth() + 1}/{new Date(item.latestMessage.createdAt).getFullYear()}
                                                                                </Text>
                                                                                :
                                                                                <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 2 / 100, letterSpacing: 1 }}>
                                                                                    {new Date(item.latestMessage.createdAt).getHours()}:{new Date(item.latestMessage.createdAt).getMinutes()}
                                                                                </Text>
                                                                        }
                                                                    </View>
                                                            }
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableHighlight>
                                        )}
                                        keyExtractor={item => item._id}
                                        ListFooterComponent={() => {
                                            return (
                                                <View style={{ height: heightsize * 5 / 100 }} />
                                            );
                                        }}
                                    />
                            }
                        </View>
                }

                {/* add new chat icon */}
                <TouchableOpacity activeOpacity={0.5} delayPressIn={0}
                    onPress={() => this.props.navigation.navigate('Contactlist')}
                    style={{
                        position: 'absolute', bottom: heightsize * 5 / 100, right: widthsize * 5 / 100, backgroundColor: topheader,
                        alignItems: 'center', justifyContent: 'center', borderRadius: 100, padding: widthsize * 4 / 100
                    }}>
                    <MediatoreIcon name='chatbubbles'
                        size={widthsize * 7 / 100}
                        color={highlightcolor} />
                </TouchableOpacity>

            </View >
        );
    }
}
