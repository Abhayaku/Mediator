import React, {Component} from 'react';
import {
  Dimensions,
  View,
  Text,
  Animated,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Splashscreen from './Component/Splashscreen';
import Login from './Component/Login';
import Otpview from './Component/Otpview';
import Homepage from './Component/Homepage';
import Chatscreen from './Component/Chatscreen';
import Contactlist from './Component/Contactlist';
import Signup from './Component/Signup';
import Setting from './Component/Setting';
import Profileview from './Component/Profileview';
import Page1 from './Component/Page1';
import Page2 from './Component/Page2';

// global variable----------------------------------------------
global.widthsize = Dimensions.get('screen').width;
global.heightsize = Dimensions.get('screen').height;
global.backgroundcolor = '#040712';
global.buttonbackground = '#162240';
global.topheader = '#081524';
global.highlightcolor = '#d45e3d';
global.textcolor = '#ffebeb';
global.statusbarcolor = '#702e1c';

const Stack = createStackNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          headerMode="none"
          initialRouteName="Page1"
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            cardOverlayEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}>
          <Stack.Screen name="Page1" component={Page1} />
          <Stack.Screen name="Page2" component={Page2} />

          {/*           <Stack.Screen
            name="Index"
            component={Index}
            options={{
              cardStyleInterpolator:
                CardStyleInterpolators.forRevealFromBottomAndroid,
            }}
          />
          <Stack.Screen name="Permission" component={Permission} />
          <Stack.Screen
            name="Information"
            component={Information}
            options={{
              cardStyleInterpolator:
                CardStyleInterpolators.forRevealFromBottomAndroid,
            }}
          />
          <Stack.Screen
            name="Splashscreen"
            component={Splashscreen}
            options={{
              cardStyleInterpolator:
                CardStyleInterpolators.forRevealFromBottomAndroid,
            }}
          />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Otpview" component={Otpview} />
          <Stack.Screen name="Homepage" component={Homepage} />
          <Stack.Screen name="Setting" component={Setting} />
          <Stack.Screen name="Profileview" component={Profileview} />
          <Stack.Screen name="Contactlist" component={Contactlist} />
          <Stack.Screen name="Chatscreen" component={Chatscreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

// index class check permission-----------------------------------------------------------------------------------------------------------------------------------------
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    await AsyncStorage.multiGet([
      'readcontact',
      'writecontact',
      'cameraaccess',
      'readstorageaccess',
      'writestorageaccess',
    ]).then((data) => {
      global.readcontact = data[0][1];
      global.writecontact = data[1][1];
      global.cameraaccess = data[2][1];
      global.readstorageaccess = data[3][1];
      global.writestorageaccess = data[4][1];
    });

    if (readcontact == 'granted') {
      if (writecontact == 'granted') {
        if (cameraaccess == 'granted') {
          if (readstorageaccess == 'granted') {
            if (writestorageaccess == 'granted') {
              this.props.navigation.navigate('Splashscreen');
            } else {
              this.props.navigation.navigate('Information');
            }
          } else {
            this.props.navigation.navigate('Information');
          }
        } else {
          this.props.navigation.navigate('Information');
        }
      } else {
        this.props.navigation.navigate('Information');
      }
    } else {
      this.props.navigation.navigate('Information');
    }
  }

  render() {
    return <View style={{flex: 1, backgroundColor: backgroundcolor}} />;
  }
}

// permission class get permission-----------------------------------------------------------------------------------------------------------------------------------------------
class Permission extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    let userpermission = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);

    let access = [
      ['cameraaccess', userpermission['android.permission.CAMERA']],
      ['readcontact', userpermission['android.permission.READ_CONTACTS']],
      ['writecontact', userpermission['android.permission.WRITE_CONTACTS']],
      [
        'readstorageaccess',
        userpermission['android.permission.READ_EXTERNAL_STORAGE'],
      ],
      [
        'writestorageaccess',
        userpermission['android.permission.WRITE_EXTERNAL_STORAGE'],
      ],
    ];
    await AsyncStorage.multiSet(access);

    //permission granted------------------------
    if (userpermission['android.permission.READ_CONTACTS'] == 'granted') {
      if (userpermission['android.permission.WRITE_CONTACTS'] == 'granted') {
        if (userpermission['android.permission.CAMERA'] == 'granted') {
          if (
            userpermission['android.permission.READ_EXTERNAL_STORAGE'] ==
            'granted'
          ) {
            if (
              userpermission['android.permission.WRITE_EXTERNAL_STORAGE'] ==
              'granted'
            ) {
              this.props.navigation.navigate('Splashscreen');
            } else {
              this.props.navigation.navigate('Information');
            }
          } else {
            this.props.navigation.navigate('Information');
          }
        } else {
          this.props.navigation.navigate('Information');
        }
      } else {
        this.props.navigation.navigate('Information');
      }
    } else {
      this.props.navigation.navigate('Information');
    }
  }

  render() {
    return <View style={{flex: 1, backgroundColor: backgroundcolor}} />;
  }
}

//permission error class----------------------------------------------------------------------------------------------------------------------------------------------------------
class Information extends Component {
  constructor() {
    super();
    this.state = {
      fadevalue: new Animated.Value(0),
    };
  }

  // mount---------------------------------------
  componentDidMount() {
    Animated.timing(this.state.fadevalue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  // allow permission---------------------------
  ok = () => {
    setTimeout(() => {
      this.props.navigation.navigate('Permission');
    }, 500);
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: backgroundcolor,
          alignItems: 'center',
          justifyContent: 'center',
          padding: (widthsize * 5) / 100,
        }}>
        <Animated.View
          style={{
            height: '20%',
            backgroundColor: buttonbackground,
            opacity: this.state.fadevalue,
            padding: (widthsize * 3) / 100,
          }}>
          <View style={{height: '30%', justifyContent: 'center'}}>
            <Text
              allowFontScaling={false}
              style={{
                color: highlightcolor,
                fontWeight: 'bold',
                fontSize: (widthsize * 3) / 100,
                letterSpacing: 1,
              }}>
              Permission Required
            </Text>
          </View>

          <View style={{height: '5%'}} />

          <View style={{height: '30%', justifyContent: 'center'}}>
            <Text
              allowFontScaling={false}
              style={{
                color: textcolor,
                fontSize: (widthsize * 2) / 100,
                letterSpacing: 1,
              }}>
              Kindly allow all the further permissions, if you want to use this
              application properly.
            </Text>
          </View>

          <View style={{height: '5%'}} />

          <View
            style={{
              height: '30%',
              alignItems: 'center',
              flexDirection: 'row-reverse',
            }}>
            <View>
              <TouchableOpacity onPress={() => this.ok()}>
                <Text
                  allowFontScaling={false}
                  style={{
                    color: highlightcolor,
                    fontSize: (widthsize * 3) / 100,
                    fontWeight: 'bold',
                    marginRight: (widthsize * 4) / 100,
                    letterSpacing: 1,
                  }}>
                  Ok
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }
}
