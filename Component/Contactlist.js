import React, { Component } from 'react';
import {
    View, Text, FlatList, TouchableHighlight, Image,
    BackHandler, RefreshControl,
} from 'react-native';
import Backicon from 'react-native-vector-icons/AntDesign';
import { UIActivityIndicator } from 'react-native-indicators';
import UserIcon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import Contacts from 'react-native-contacts';

export default class Contactlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userdata: [],
            contactphonenumber: [],
            logout: false,
            Showindicator: true,
            chatlist: '',
            refreshing: false
        };
    }

    // mount----------------------------------------------------------------------------------------------------------------------------------------------
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backpress);
        Contacts.getAll().then((list) => {
            list.filter((item, i) => {
                item.phoneNumbers.filter((phone, j) => {
                    if (phone.label === "mobile") {
                        if (phone.number.startsWith("+91")) {
                            this.state.contactphonenumber.push(phone.number.substring(3));
                        }
                        else {
                            this.state.contactphonenumber.push(phone.number);
                        }
                    }
                });
            });
            setTimeout(() => {
                for (var i = 0; i < this.state.contactphonenumber.length; i++) {
                    this.state.contactphonenumber[i] = this.state.contactphonenumber[i].replace(/\s/g, '')
                }
                setTimeout(() => {
                    this.getcontactlist();
                }, 100);
            }, 100);
        })
    }

    // get contact list----------------------------------------------------------------------------------------------------------------------------------------------
    getcontactlist = () => {
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
        // delete duplicate value
        setTimeout(() => {
            var contactphonenumber = this.state.contactphonenumber.reduce((x, y) => x.includes(y) ? x : [...x, y], []);
            this.setState({ contactphonenumber: contactphonenumber });
        }, 100);
        // match the phone number
        setTimeout(() => {
            var userdata = [];
            for (var i = 0; i < this.state.userdata.length; i++) {
                for (var j = 0; j < this.state.contactphonenumber.length; j++) {
                    if (this.state.userdata[i].phonenumber == this.state.contactphonenumber[j]) {
                        userdata.push(this.state.userdata[i]);
                    }
                }
            }
            // filter with own number
            setTimeout(async () => {
                const phonenumber = await AsyncStorage.getItem('phonenumber');
                var actualdata = userdata.filter(function (data) {
                    return data.phonenumber != phonenumber;
                });
                this.setState({ userdata: actualdata });
                setTimeout(() => {
                    this.state.userdata.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
                    setTimeout(() => {
                        this.setState({ Showindicator: false, refreshing: false });
                    }, 100);
                }, 100);
            }, 100);
        }, 100);
    }

    // back press----------------------------------------------------------------------------------------------------------------------------
    backpress = () => {
        this.props.navigation.goBack();
        return true;
    }

    // check existance of user----------------------------------------------------------------------------------------------------------------------------
    checkexistance = async (title) => {
        const phonenumber = await AsyncStorage.getItem('phonenumber');
        var unique = true;
        firestore().collection('Mediator').doc(phonenumber).collection("Chatroom").onSnapshot(querySnapshot => {
            querySnapshot.docs.map(doc => {
                if (doc._data.phonenumber == title.phonenumber) {
                    unique = false;
                }
            });
        });
        setTimeout(() => {
            if (unique == true) {
                //  sender room 
                firestore().collection('Mediator').doc(phonenumber).collection("Chatroom").add({
                    name: title.name,
                    phonenumber: title.phonenumber,
                    imageurl: title.imageurl,
                    latestMessage: {
                        text: `Sender`,
                        createdAt: new Date().getTime()
                    }
                }).then(docRef => {
                    docRef.collection('Message').add({
                        text: `Sender`,
                        createdAt: new Date().getTime(),
                        system: true
                    });
                    setTimeout(() => {
                        this.getmessage(title);
                    }, 100);
                });
            }
            else {
                setTimeout(() => {
                    this.getmessage(title);
                }, 100);
            }
        }, 100);
    }

    // get old message----------------------------------------------------------------------------------------------------------------------------
    getmessage = async (title) => {
        const phonenumber = await AsyncStorage.getItem('phonenumber');
        const contactphone = title.phonenumber;
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
        });
        setTimeout(() => {
            var title = this.state.chatlist.filter(function (data) {
                return data.phonenumber == contactphone;
            });
            this.props.navigation.navigate('Chatscreen', { title: title[0] });
        }, 100);
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
                        <Text allowFontScaling={false} style={{ color: highlightcolor, fontSize: widthsize * 3.5 / 100 }}>
                            Select Contact
                        </Text>
                    </View>
                </View >
                {
                    this.state.Showindicator == true
                        ?
                        <View style={{ flex: 1, backgroundColor: backgroundcolor, alignItems: "center", justifyContent: 'center' }}>
                            <UIActivityIndicator color={highlightcolor} size={widthsize * 9 / 100} count={5} />
                        </View>
                        :
                        <View style={{ flex: 1, backgroundColor: backgroundcolor }}>
                            {
                                this.state.userdata.length == 0
                                    ?
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 3 / 100, textAlign: 'center' }}>
                                            There is  no contact to show.
                                        </Text>
                                        <Text allowFontScaling={false} style={{ color: highlightcolor, fontSize: widthsize * 3 / 100, textAlign: 'center', marginTop: 5 }}>
                                            When a contact create the account it will appear here.
                                         </Text>
                                    </View>
                                    :
                                    <FlatList
                                        data={this.state.userdata}
                                        refreshControl={
                                            <RefreshControl
                                                colors={[highlightcolor, highlightcolor]}
                                                progressBackgroundColor={buttonbackground}
                                                refreshing={this.state.refreshing}
                                                onRefresh={this.onRefresh}
                                            />
                                        }
                                        style={{ flex: 1 }}
                                        renderItem={({ item }) => (
                                            <TouchableHighlight activeOpacity={0.6} delayPressIn={0} onPress={() => this.checkexistance(item)}
                                                underlayColor={buttonbackground}>
                                                <View style={{ padding: widthsize * 3 / 100, borderBottomWidth: 1, borderColor: buttonbackground, }}>
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
                                                                <Image source={{ uri: item.imageurl }}
                                                                    style={{
                                                                        width: widthsize * 12 / 100, height: widthsize * 12 / 100, borderColor: highlightcolor,
                                                                        borderRadius: (widthsize * 12 / 100) / 2, overflow: 'hidden', borderWidth: 1
                                                                    }} />
                                                        }
                                                        <View style={{ flex: 1, marginLeft: widthsize * 3 / 100 }}>
                                                            <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 3 / 100 }}>
                                                                {item.name}
                                                            </Text>
                                                            <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 2.5 / 100, opacity: 0.5, marginTop: 5 }}>
                                                                {item.phonenumber}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableHighlight>
                                        )}
                                        keyExtractor={item => item.phonenumber}
                                    />
                            }
                        </View>
                }
            </View >
        );
    }
}
