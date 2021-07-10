import React, {useState, useEffect} from 'react';
import {View, Switch, Image, TouchableOpacity, StyleSheet} from 'react-native';
import colors from '../../constants/colors';
import commonStyles from '../../constants/commonStyles';
import dimensions from '../../constants/dimensions';
import responsiveFont from '../../constants/responsiveFont';
import MyText from '../ui/MyText';
import {HeaderBackButton} from '@react-navigation/stack';
import {logOut} from '../../redux/actions/user';
import {useDispatch, useSelector} from 'react-redux';
// GoogleSignin.configure({
//   webClientId:
//     '783601258644-22q6339e760btiecpeau893l0kvbqjhm.apps.googleusercontent.com',
//   offlineAccess: true,
//   scopes: ['profile', 'email'],
// });

const DrawerItem = props => {
  let TouchOrView = props.touch ? TouchableOpacity : View;
  const [enableNotify, setEnableNotify] = useState(true);
  const onChangeNotify = () => {
    setEnableNotify(prev => !prev);
  };

  return (
    <TouchOrView
      activeOpacity={0.6}
      style={{paddingHorizontal: '7.5%', marginVertical: '3.5%'}}
      onPress={props.onPress}>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            flex: 0.15,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image source={props.icon} style={styles.itemIcon} />
        </View>
        <View style={{flex: 0.75, justifyContent: 'center'}}>
          <MyText text={props.title} style={styles.itemTitle} />
        </View>
        <View style={{flex: 0.1}}>
          {props.switch && (
            <Switch
              trackColor={{false: colors.borderColor, true: colors.borderColor}}
              thumbColor={enableNotify ? colors.primary : colors.white}
              ios_backgroundColor="#3e3e3e"
              onValueChange={onChangeNotify}
              value={enableNotify}
              style={{width: '100%', height: 30}}
            />
          )}
          {props.rightArrow && (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={require('../../assets/icons/rightArrow.png')}
                style={{tintColor: colors.primary, alignSelf: 'center'}}
              />
            </View>
          )}
        </View>
      </View>
      {!props.border && <View style={styles.borderLine} />}
    </TouchOrView>
  );
};

const DrawerContent = props => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user.userData);
  const token = useSelector(state => state.user);
  const [enableNotify, setEnableNotify] = useState(true);
  const onChangeNotify = () => {
    setEnableNotify(prev => !prev);
  };
  const logOutHandler = async () => {
    await dispatch(logOut());
    // props.navigation.toggleDrawer();
    props.navigation.navigate('Home');
  };
  return (
    <View style={commonStyles.mainView2}>
      <View style={styles.headerCon}>
        <View
          style={{
            flex: 0.5,
            justifyContent: 'center',
          }}>
          <HeaderBackButton
            pressColorAndroid={'rgba(255,255,255,0)'}
            tintColor={colors.white}
            onPress={() => props.navigation.toggleDrawer()}
          />
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <MyText text={'Menu'} fontType={3} style={styles.headerTitle} />
        </View>
        <View style={{flex: 0.5}} />
      </View>
      <View style={{padding: '7.5%'}}>
        <View>
          <MyText
            text={'Mobile Number'}
            fontType={4}
            style={styles.mobileNumber}
          />
          <View
            style={{
              flexDirection: 'row',
              marginTop: '5%',
              justifyContent: 'space-between',
            }}>
            <View style={{flex: 0.2}}>
              <View style={styles.cardCon}>
                <Image
                  source={require('../../assets/icons/indiaFlag.png')}
                  style={styles.flagIcon}
                />
              </View>
            </View>
            <View
              style={{
                flex: 0.6,
                justifyContent: 'center',
              }}>
              <View
                style={[
                  styles.cardCon,
                  {justifyContent: 'flex-start', paddingHorizontal: '7.5%'},
                ]}>
                <MyText
                  text={userData.phone}
                  fontType={2}
                  style={styles.zipCodeTxt}
                />
              </View>
            </View>
            <View
              style={{
                flex: 0.1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/icons/rightArrow.png')}
                style={{tintColor: colors.primary}}
              />
            </View>
          </View>
        </View>
      </View>
      <View>
        <DrawerItem
          title={'My Orders'}
          icon={require('../../assets/icons/orders.png')}
          touch
          onPress={() => props.navigation.navigate('Home', {screen: 'Home'})}
        />
        <DrawerItem
          title={'Manage Addresses'}
          icon={require('../../assets/icons/Globe.png')}
          touch
          onPress={() => props.navigation.navigate('Mange Address')}
        />
        <DrawerItem
          title={'Notifications'}
          icon={require('../../assets/icons/notify.png')}
          switch
          value={enableNotify}
          onChangeNotify={onChangeNotify}
        />
      </View>
      <View style={{marginTop: '40%'}}>
        <DrawerItem
          title={'Logout'}
          icon={require('../../assets/icons/logout.png')}
          touch
          border
          onPress={logOutHandler}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerCon: {
    width: dimensions.width,
    height: dimensions.height * 0.076,
    backgroundColor: colors.primary,
    flexDirection: 'row',
  },
  headerTitle: {
    fontSize: responsiveFont(18.5),
    color: colors.white,
    lineHeight: 24,
  },
  mobileNumber: {
    fontSize: responsiveFont(20),
  },
  cardCon: {
    backgroundColor: colors.white,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.borderColor,
    flexDirection: 'row',
    paddingHorizontal: dimensions.width * 0.0125,
    paddingVertical: dimensions.width * 0.025,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  flagIcon: {
    width: dimensions.width * 0.07,
    height: dimensions.width * 0.07,
    resizeMode: 'contain',
  },
  zipCodeTxt: {
    color: colors.black,
    fontSize: responsiveFont(16),
    lineHeight: 26,
  },
  itemIcon: {
    width: dimensions.width * 0.065,
    height: dimensions.width * 0.065,
    resizeMode: 'contain',
  },
  itemTitle: {
    color: colors.black,
    fontSize: responsiveFont(18),
  },
  borderLine: {
    marginTop: dimensions.height * 0.01,
    width: '95%',
    height: dimensions.height * 0.002,
    backgroundColor: colors.borderColor,
    alignSelf: 'center',
  },
});

export default DrawerContent;
